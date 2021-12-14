import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { CloudFrontWebDistribution } from "aws-cdk-lib/aws-cloudfront";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";


export class BlogFrontendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucket = new Bucket(this, 'BlogFrontendBucket', {
      publicReadAccess: true,
      removalPolicy: RemovalPolicy.DESTROY,
      websiteIndexDocument: 'index.html',
    });

    new BucketDeployment(this, 'DeployBlogFrontend', {
      sources: [Source.asset('../frontend/build')],
      destinationBucket: bucket,
    });

    new CloudFrontWebDistribution(this, 'BlogFrontendCFDistribution', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket,
          },
          behaviors: [{ isDefaultBehavior: true }],
        },
      ],
    });

  }
}