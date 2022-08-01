const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

const getPostById = async (author: string, postId: string) => {
  console.log(`getPostsById called with: (${author}, ${postId})`);

  const params = {
    TableName: process.env.POSTS_TABLE,
    Key: {
      PK: `POST#${author}`,
      SK: postId,
    },
    ReturnConsumedCapacity: "TOTAL",
  };

  try {
    const data = await docClient.get(params).promise();

    console.log(`data: ${JSON.stringify(data, null, 2)}`);

    return data.Item;
  } catch (err) {
    console.log(`err: ${JSON.stringify(err, null, 2)}`);

    return null;
  }
};

export default getPostById;
