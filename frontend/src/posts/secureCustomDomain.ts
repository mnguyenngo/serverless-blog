const secureCustomDomain = `
  # Deploying a Secure Website with a Custom Domain

  In the last post, [Deploying a React Blog with AWS CDK and S3](./deploying-react-on-aws), I deployed a static website to AWS with a URL with a CloudFront top-level domain (TLD). In this post, I'll outline the process of deploying a secure website with a custom domain. At the time of this writing, I noticed that Github Copilot makes suggestions for this post. So, I'll be fairly liberal with accepting the suggestions and we'll see how it goes.

  <img src="https://raw.githubusercontent.com/cdk-patterns/serverless/master/s3-angular-website/img/architecture.PNG" alt="Secure Site Diagram" width="90%" />
  *Image source: https://github.com/cdk-patterns/serverless/blob/main/s3-angular-website/README.md*


  ## The Custom Domain

  The CloudFront distribution created in my previous post came with a secure CloudFront URL. Although this is nice, having a custom domain with my name is much better. My domain was actually managed in Google Domains but I chose to transfer it over to AWS Route 53 in order to make deployment as easy as possible. I create the hosted zone using the Route 53 <code>HostedZone</code> construct and define the site domain below.

  ~~~
  this.zone = HostedZone.fromLookup(this, "HostedZone", {
    domainName: props.domainName,
  });
  this.siteDomain = props.siteSubDomain + "." + props.domainName;
  new CfnOutput(this, "Site", { value: "https://" + this.siteDomain });
  ~~~

  ## The SSL/TLS Certificate

  In order to deploy a website with a secure domain, you will need to have an SSL/TLS certificate which can be provided by the [AWS Certificate Manager (ACM)](https://aws.amazon.com/certificate-manager/). You can create and use public certificates from ACM for free. Other sources for SSL/TLS certificates include [Let's Encrypt](https://letsencrypt.org/) and [Certificate Authority](https://www.certificate-authority.com/).

  In the CDK code, we can create a new certificate using the Certificate construct with the site domain and hosted zone created in the previous step. We will use the certificate to create a ViewerCertificate which will then be passed to the <code>CloudFrontWebDistribution</code> construct as a property.

  ~~~
  const certificate = new Certificate(this, "WebsiteCertificate", {
    domainName: this.siteDomain,
    validation: CertificateValidation.fromDns(this.zone),
  });

  this.viewerCertificate = ViewerCertificate.fromAcmCertificate(
    {
      certificateArn: certificate.certificateArn,
      env: {
        region: props.env.region as string,
        account: props.env.account as string,
      },
      node: this.node,
      stack: parent,
      metricDaysToExpiry: () =>
        new Metric({
          namespace: "TLS Viewer Certificate Validity",
          metricName: "TLS Viewer Certificate Expired",
        }),
      // https://github.com/aws-samples/aws-cdk-examples/issues/584
      // the type does not seem correct here, but this value will work for now
      applyRemovalPolicy: certificate.applyRemovalPolicy,
    },
    {
      sslMethod: SSLMethod.SNI,
      securityPolicy: SecurityPolicyProtocol.TLS_V1_2016,
      aliases: [this.siteDomain],
    }
  );
  ~~~

  I organized the hosted zone and certificate constructs into a separate <code>CertificateStack</code> so that they can be created in the AWS account before the <code>BlogFrontendStack</code> is deployed. The <code>BlogFrontendStack</code> depends on properties that are defined in the <code>CertificateStack</code>.

  ## Update the BlogFrontendStack

  All that is left to do now is to update the <code>BlogFrontendStack</code> to use the <code>ViewerCertificate</code> that we created in the <code>CertificateStack</code>.

  ~~~
  const distribution = new CloudFrontWebDistribution(
    this,
    "BlogFrontendCFDistribution",
    {
      viewerCertificate: props.viewerCertificate,
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket,
            originAccessIdentity: cloudfrontOAI,
          },
          behaviors: [
            {
              isDefaultBehavior: true,
              compress: true,
              allowedMethods: CloudFrontAllowedMethods.GET_HEAD_OPTIONS,
            },
          ],
        },
      ],
      errorConfigurations: [
        {
          errorCode: 403,
          errorCachingMinTtl: 10,
          responseCode: 200,
          responsePagePath: "/index.html",
        },
      ],
    }
  );
  ~~~

  The <code>BucketDeployment</code> was updated to include the CloudFront distribution as a prop which will [enable the distribution edge caches to be invalidated after files are uploaded to the bucket](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_s3_deployment.BucketDeployment.html#distribution). This means that when the bucket receives updated build files for the static site, users will be served the new changes instead of seeing the previously cached version.

  ~~~
  new BucketDeployment(this, "DeployBlogFrontend", {
    sources: [Source.asset("../frontend/build")],
    destinationBucket: bucket,
    distribution: distribution,
    distributionPaths: ["/*"],
  });
  ~~~

  I also create an alias for *.nguyenngo.com to point to the CloudFront distribution by adding the ARecord and AaaaRecord constructs.

  ~~~
  new ARecord(this, "ARecord", {
    recordName: props.siteDomain,
    target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
    zone: props.zone,
  });

  new AaaaRecord(this, "AAAARecord", {
    recordName: props.siteDomain,
    target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
    zone: props.zone,
  });
  ~~~

  ## Conclusion

  At this point, I can now deploy a secure website with a custom domain all configured using CDK. I will definitely be using this setup for future projects and my next challenge will be including Lambdas and API Gateways to serve as the backend for future websites. I hope you found this post helpful. Happy coding!

  ## References
  1. AWS CDK example for secure and static sites: https://github.com/aws-samples/aws-cdk-examples/tree/master/typescript/static-site
  2. AWS Docs - Routing to CloudFront Distribution: https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-cloudfront-distribution.html
  3. AWS Docs - Configuring DNSSEC for a domain: https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/domain-configure-dnssec.html
    - My custom domain did not successfully route traffic to the CloudFront distribution at first. After transferring the domain to Route 53, I saw that the name servers were carried over from Google Domains. I updated the name servers to match the ones that were created for the Route 53 hosted zone. It was at this time that I removed the DNSSEC configuration. I found that I needed to configure DNSSEC for the domain in order for it to work properly.
  4. Relevant commit: https://github.com/mnguyenngo/serverless-blog/commit/71670d0ee9b974c9a13a678b0ec6e750f72ecfb9
`;

export default secureCustomDomain;
