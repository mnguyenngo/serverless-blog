const startingTheBlogPost = `
  # Deploying a React Blog with AWS CDK and S3

  Hi! You landed on my first post for this blog. In this post, I'll be detailing the steps to deploy a blog website on AWS. In fact, the site that you are reading right now was deployed with these steps. You can find the code [here](https://github.com/mnguyenngo/serverless-blog).

  ## Steps

  ### Prerequisites

  1. Install CDK: https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html#getting_started_install
  2. Install create-react-app: https://create-react-app.dev/docs/getting-started/


  #### Assumptions

  1. You have npm and/or yarn installed on your computer already and
  2. You have an existing AWS account
  3. You have the AWS CLI installed with your credentials configured.


  #### What is CDK and why am I using it?
  CDK stands for Cloud Deployment Kit. It is AWS's implementation of Infrastructure as Code (IaC), where you can configure the AWS resources that you need with Typescript or Python code. For other cloud providers or if you are on the multi-cloud path, you might want to take a look at [Terraform](https://www.terraform.io/) or [Pulumi](https://www.pulumi.com/). If you are planning on using AWS as your single cloud provider, then it is definitely worth the time getting started with CDK. The main advantages are (1) you can check in your infrastructure configurations into Github to track changes over time and (2) you can define certain infrastructure components as a module and reuse them as many times as needed. You can read more about CDK [here](https://docs.aws.amazon.com/cdk/v2/guide/home.html).


  ### Initialize the project

  1. Create the project directory.
  2. Go into the project folder and create the __cdk__ directory.

  ~~~
  cdk init app --language typescript
  ~~~

  3. From the project directory, create the frontend app.

  ~~~
  npx create-react-app frontend --template typescript
  ~~~


  ### Build and test the starter React code

  While in the **/frontend** directory, run the following commands to build and test the code.

  <code>
    yarn build && yarn start
  </code>

  After running the above command, your browser should automatically open a tab to \`localhost:3000\` where you will see the spinning React logo.


  ### Configure the S3 bucket to host your site

  Now, we will deploy this starter site to an S3 bucket by creating the __BlogFrontendStack__. This stack creates an S3 bucket and deploys the frontend __build__ directory to it. Because we are setting up the S3 bucket to host a website, we set __publicReadAccess__ to __true__. The __CloudFrontWebDistribution__ object will put the static files in the S3 bucket on AWS's content delivery network so that the website will load fast for all users around the world. See [this article for more information](https://aws.amazon.com/blogs/networking-and-content-delivery/amazon-s3-amazon-cloudfront-a-match-made-in-the-cloud/)

  ~~~
  // cdk/lib/blog-frontend-stack.ts
  import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
  import { CloudFrontWebDistribution } from "aws-cdk-lib/aws-cloudfront";
  import { Bucket } from "aws-cdk-lib/aws-s3";
  import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
  import { Construct } from "constructs";

  export class BlogFrontendStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
      super(scope, id, props)

      const bucket = new Bucket(this, 'BlogFrontendBucket', {
        publicReadAccess: true,
        removalPolicy: RemovalPolicy.DESTROY,
        websiteIndexDocument: 'index.html',
      })

      new BucketDeployment(this, 'DeployBlogFrontend', {
        sources: [Source.asset('../frontend/build')],
        destinationBucket: bucket,
      })

      new CloudFrontWebDistribution(this, 'BlogFrontendCFDistribution', {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: bucket,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
      })
    }
  }
  ~~~


  ### Initialize the BlogFrontendStack in cdk.ts and deploy to AWS

  After defining the __BlogFrontendStack__, we need to import it into __cdk.ts__ and create an instance of it.

  ~~~
  // cdk/bin/cdk.ts
  import 'source-map-support/register';
  import * as cdk from 'aws-cdk-lib';
  import { BlogFrontendStack } from '../lib/blog-frontend-stack';

  const app = new cdk.App();
  new BlogFrontendStack(app, 'BlogFrontendStack', {});
  ~~~

  When you run __cdk list__ in your terminal, __BlogFrontendStack__ should be returned in the output. You can also run __cdk synth__ to see the generated CloudFormation template. Prior to CDK, writing CloudFormation templates manually was the primary way of provisioning AWS resources.

  The last step is to deploy! Run the following in your terminal and confirm to deploy your static site to AWS. Put the URL in your browser and see the end result in all its glory.

  ~~~
  cdk deploy
  ~~~

  After the deploy step is successful, you can log into the AWS CloudFront console and see the newly created distribution. Under the __Domain Name__ column, you will find the URL for your static site.


  ### Next steps

  The first thing I would do now is update the frontend code to deploy my custom React project. Then, I would add my own custom domain so that the site is using the __cloudfront.net__ domain name. When making changes to the frontend code, make sure to run __yarn build__ in your terminal from the __frontend/__ directory to update the __build__ directory before deploying it. Otherwise, you won't see your latest changes when you check the deployed site. Happy coding!


  ## References

  1. One of the first references I read for deploying a single page app using CDK: https://github.com/cdk-patterns/serverless/tree/main/s3-react-website/typescript
  2. The construct that is used by the above reference: https://github.com/nideveloper/CDK-SPA-Deploy
  3. AWS blog article on using CloudFront with S3 webites: https://aws.amazon.com/blogs/networking-and-content-delivery/amazon-s3-amazon-cloudfront-a-match-made-in-the-cloud/
  4. AWS CDK example for static sites: https://github.com/aws-samples/aws-cdk-examples/tree/master/typescript/static-site

`;

export default startingTheBlogPost;