const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

const setPublish = async (
  author: string,
  postId: string,
  published: boolean
) => {
  const params = {
    TableName: process.env.POSTS_TABLE,
    Key: {
      PK: `POST#${author}`,
      SK: postId,
    },
    UpdateExpression:
      "set #published = :published, #publishDate = :publishDate",
    ExpressionAttributeNames: {
      "#published": "published",
      "#publishDate": "publishDate",
    },
    ExpressionAttributeValues: {
      ":published": published,
      ":publishDate": published ? new Date().toISOString() : null,
    },
    ReturnValues: "ALL_NEW",
    ReturnConsumedCapacity: "TOTAL",
  };

  console.log(`params: ${JSON.stringify(params, null, 2)}`);

  try {
    const updatedPost = await docClient.update(params).promise();

    console.log(`updatedPublishPost: ${JSON.stringify(updatedPost, null, 2)}`);

    return updatedPost.Attributes;
  } catch (err) {
    console.log(`DynamoDB Error: ${JSON.stringify(err, null, 2)}`);

    return null;
  }
};

export default setPublish;
