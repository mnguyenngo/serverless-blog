#!/usr/bin/env node
import { App, Environment, Stack, StackProps } from "aws-cdk-lib";
import { BlogFrontendStack } from "../lib/blog-frontend-stack";
import { CertificateStack } from "../lib/certificate-stack";
import { CognitoStack } from "../lib/cognito-stack";
import { PostApiStack } from "../lib/post-api-stack";
require("dotenv").config({ path: ".env" });

const targetRegion = "us-east-1";

const app = new App();

class MyBlog extends Stack {
  constructor(parent: App, name: string, props: StackProps) {
    super(parent, name, props);
    const certificate = new CertificateStack(this, "CertificateStack", {
      env: props.env as Environment,
      domainName: "nguyenngo.com",
      siteSubDomain: "*",
    });

    new BlogFrontendStack(this, "FrontendStack", {
      env: props.env as Environment,
      siteDomain: certificate.siteDomain,
      viewerCertificate: certificate.viewerCertificate,
      zone: certificate.zone,
    });

    const cognito = new CognitoStack(this, "CognitoStack", {
      env: props.env as Environment,
    });

    new PostApiStack(this, "PostApiStack", {
      env: props.env as Environment,
      userPool: cognito.userPool,
    });
  }
}

new MyBlog(app, "NguyenNgoBlog", {
  env: {
    region: targetRegion,
    account: process.env.AWS_ACCOUNT,
  },
});
