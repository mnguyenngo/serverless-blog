const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

type ddbQueryParams = {
  TableName: string;
  KeyConditionExpression: string;
  ExpressionAttributeNames: { [key: string]: string };
  ExpressionAttributeValues: { [key: string]: any };
  FilterExpression?: string;
  ReturnConsumedCapacity?: "INDEXES" | "TOTAL" | "NONE";
  ScanIndexForward?: boolean;
};

const getPublishedPosts = async (author: string) => {
  console.log(`getPublishedPosts called with: ${author}`);

  const params: ddbQueryParams = {
    TableName: process.env.POSTS_TABLE || "",
    KeyConditionExpression: "#PK = :post_partition",
    FilterExpression: "#published = :published",
    ExpressionAttributeNames: {
      "#PK": "PK",
      "#published": "published",
    },
    ExpressionAttributeValues: {
      ":post_partition": `POST#${author}`,
      ":published": true,
    },
    ReturnConsumedCapacity: "TOTAL",
    ScanIndexForward: false,
  };

  try {
    const data = await docClient.query(params).promise();

    console.log(`data: ${JSON.stringify(data, null, 2)}`);

    // return AWS.DynamoDB.Converter.unmarshall(data.Items);
    return data.Items;
  } catch (err) {
    console.log(`err: ${JSON.stringify(err, null, 2)}`);

    return null;
  }
};

export default getPublishedPosts;
