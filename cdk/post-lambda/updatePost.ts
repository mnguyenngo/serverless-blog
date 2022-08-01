var slugify = require("slugify");
const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
import { PostInput, PostUpdateableFields } from "./Post";

const updatePost = async (
  author: string,
  postId: string,
  postInput: PostInput
) => {
  const titleSlug = slugify(postInput.title.split(" ").slice(0, 4).join(" "), {
    lower: true,
    strict: true,
  });

  const post: PostUpdateableFields = {
    titleSlug,
    title: postInput.title,
    content: postInput.content,
    updated: new Date().toISOString(),
  };

  const params = {
    TableName: process.env.POSTS_TABLE,
    Key: {
      PK: `POST#${author}`,
      SK: postId,
    },
    UpdateExpression:
      "set #title = :title, #content = :content, #updated = :updated, #titleSlug = :titleSlug",
    ExpressionAttributeNames: {
      "#title": "title",
      "#content": "content",
      "#updated": "updated",
      "#titleSlug": "titleSlug",
    },
    ExpressionAttributeValues: {
      ":title": post.title,
      ":content": post.content,
      ":updated": post.updated,
      ":titleSlug": post.titleSlug,
    },
    ReturnValues: "ALL_NEW",
    ReturnConsumedCapacity: "TOTAL",
  };

  console.log(`params: ${JSON.stringify(params, null, 2)}`);

  try {
    const updatedPost = await docClient.update(params).promise();

    console.log(`updatedPost: ${JSON.stringify(updatedPost, null, 2)}`);

    return updatedPost.Attributes;
  } catch (err) {
    console.log(`DynamoDB Error: ${JSON.stringify(err, null, 2)}`);

    return null;
  }
};

export default updatePost;
