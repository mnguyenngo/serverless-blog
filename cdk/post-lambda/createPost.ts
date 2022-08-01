var slugify = require("slugify");
const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
import { PostInput, Post } from "./Post";

const createPost = async (postInput: PostInput) => {
  console.log(
    `createPost invocation event: ${JSON.stringify(postInput, null, 2)}`
  );

  const titleSlug = slugify(postInput.title.split(" ").slice(0, 4).join(" "), {
    lower: true,
    strict: true,
  });
  const postId = Date.now().toString();

  const post: Post = {
    titleSlug,
    postId,
    title: postInput.title,
    content: postInput.content,
    author: postInput.author,
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
    viewCount: 0,
    published: false,
    publishDate: null,
  };

  const params = {
    TableName: process.env.POSTS_TABLE,
    Item: {
      PK: `POST#${postInput.author}`,
      SK: postId,
      type: "post",
      ...post,
    },
    ReturnConsumedCapacity: "TOTAL",
  };

  try {
    await docClient.put(params).promise();
    return post;
  } catch (err) {
    console.log(`DynamoDB Error: ${JSON.stringify(err, null, 2)}`);

    return null;
  }
};

export default createPost;
