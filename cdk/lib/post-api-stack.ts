import {
  CfnOutput,
  Duration,
  Expiration,
  Stack,
  StackProps,
} from "aws-cdk-lib";
import { IUserPool } from "aws-cdk-lib/aws-cognito";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import {
  AuthorizationType,
  FieldLogLevel,
  GraphqlApi,
  Schema,
  UserPoolDefaultAction,
} from "@aws-cdk/aws-appsync-alpha";
import {
  Code,
  Function as LambdaFunction,
  Runtime,
} from "aws-cdk-lib/aws-lambda";

interface PostApiStackProps extends StackProps {
  readonly userPool: IUserPool;
}

export class PostApiStack extends Stack {
  constructor(parent: Stack, id: string, props: PostApiStackProps) {
    super(parent, id, props);

    const postsTable = new Table(this, "PostsTable", {
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "PK",
        type: AttributeType.STRING,
      },
      sortKey: {
        name: "SK",
        type: AttributeType.STRING,
      },
    });
    new CfnOutput(this, "PostsTableName", {
      value: postsTable.tableName,
    });

    const postLambda = new LambdaFunction(this, "PostLambda", {
      runtime: Runtime.NODEJS_14_X,
      handler: "main.handler",
      code: Code.fromAsset("post-lambda"),
      memorySize: 512,
      environment: {
        POSTS_TABLE: postsTable.tableName,
      },
    });
    postsTable.grantFullAccess(postLambda);

    const api = new GraphqlApi(this, "PostApi", {
      name: "post-appsync-api",
      schema: Schema.fromAsset("./graphql/schema.graphql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: Expiration.after(Duration.days(365)),
          },
        },
        additionalAuthorizationModes: [
          {
            authorizationType: AuthorizationType.USER_POOL,
            userPoolConfig: {
              userPool: props.userPool,
              appIdClientRegex: ".*",
              defaultAction: UserPoolDefaultAction.ALLOW,
            },
          },
        ],
      },
      logConfig: {
        fieldLogLevel: FieldLogLevel.ERROR,
      },
      xrayEnabled: false,
    });

    // Prints out the AppSync GraphQL endpoint to the terminal
    new CfnOutput(this, "PostsGraphQLAPIURL", {
      value: api.graphqlUrl,
    });

    // Prints out the AppSync GraphQL API key to the terminal
    new CfnOutput(this, "PostGraphQLAPIKey", {
      value: api.apiKey || "",
    });

    // Prints out the stack region to the terminal
    new CfnOutput(this, "Stack Region", {
      value: this.region,
    });

    const postDataSource = api.addLambdaDataSource(
      "PostDataSource",
      postLambda
    );
    postDataSource.createResolver({
      typeName: "Query",
      fieldName: "getPostById",
    });
    postDataSource.createResolver({
      typeName: "Query",
      fieldName: "getPosts",
    });
    postDataSource.createResolver({
      typeName: "Query",
      fieldName: "getPublishedPosts",
    });
    postDataSource.createResolver({
      typeName: "Mutation",
      fieldName: "createPost",
    });
    postDataSource.createResolver({
      typeName: "Mutation",
      fieldName: "updatePost",
    });
    postDataSource.createResolver({
      typeName: "Mutation",
      fieldName: "deletePost",
    });
    postDataSource.createResolver({
      typeName: "Mutation",
      fieldName: "publishPost",
    });
    postDataSource.createResolver({
      typeName: "Mutation",
      fieldName: "unpublishPost",
    });
  }
}
