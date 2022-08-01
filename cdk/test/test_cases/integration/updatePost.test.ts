import deletePost from "../../../post-lambda/deletePost";
const given = require("../../steps/given");
const when = require("../../steps/when");

describe("When updatePost is invoked", () => {
  let ddbPost: any;

  beforeAll(async () => {
    ddbPost = await given.a_random_ddb_post();
  });

  afterAll(async () => {
    console.log("Deleting test posts in DDB");
    await deletePost("IntegrationTest", ddbPost.postId);
  });

  it("should change the post in DDB", async () => {
    const updatedPost = await given.a_random_post_input();

    const updatedDdbPost = await when.we_invoke_updatePost(
      ddbPost.author,
      ddbPost.postId,
      updatedPost
    );

    expect(updatedDdbPost).toMatchObject({
      PK: `POST#${ddbPost.author}`,
      SK: ddbPost.postId,
      title: updatedPost.title, // we expect this to match the updated title
      content: updatedPost.content, // we expect this to match the updated content
      author: ddbPost.author,
      created: ddbPost.created,
      updated: expect.stringMatching(
        /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/
      ),
      type: "post",
      viewCount: 0,
      published: false,
      publishDate: null,
    });
  });
});
