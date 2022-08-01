const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

const deletePost = async (author: string, postId: string) => {
  const params = {
    TableName: process.env.POSTS_TABLE,
    Key: {
      PK: `POST#${author}`,
      SK: postId,
    },
    ReturnConsumedCapacity: "TOTAL",
  };

  try {
    await docClient.delete(params).promise();
    return postId;
  } catch (err) {
    console.log(`DynamoDB Error: ${JSON.stringify(err, null, 2)}`);

    return null;
  }
};

export default deletePost;
