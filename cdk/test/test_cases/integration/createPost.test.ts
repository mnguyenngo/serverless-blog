import { PostInput } from "../../../post-lambda/Post";
import deletePost from "../../../post-lambda/deletePost";
const given = require("../../steps/given");
const when = require("../../steps/when");
const then = require("../../steps/then");

describe("When createPost is invoked", () => {
  let idsToDelete: string[] = [];

  afterAll(async () => {
    console.log("Deleting test posts in DDB");

    while (idsToDelete.length > 0) {
      const id = idsToDelete.pop();
      if (id) {
        await deletePost("IntegrationTest", id);
      }
    }
  });

  it("should create a post in DDB", async () => {
    const postInput: PostInput = given.a_random_post_input();
    const post = await when.we_invoke_createPost(postInput);

    console.log(`post: ${JSON.stringify(post, null, 2)}`);

    const ddbPost = await then.post_exists_in_ddb(
      postInput.author,
      post.postId
    );

    console.log(`ddbPost: ${JSON.stringify(ddbPost, null, 2)}`);

    expect(ddbPost).toMatchObject({
      PK: `POST#${postInput.author}`,
      SK: post.postId,
      title: postInput.title,
      content: postInput.content,
      author: postInput.author,
      created: expect.stringMatching(
        /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/
      ),
      updated: expect.stringMatching(
        /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/
      ),
      type: "post",
      viewCount: 0,
      published: false,
      publishDate: null,
    });

    idsToDelete.push(post.postId);
  });
});
