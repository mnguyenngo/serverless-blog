import deletePost from "../../../post-lambda/deletePost";
const given = require("../../steps/given");
const when = require("../../steps/when");

describe("When publishPost is invoked", () => {
  let ddbPost: any;

  beforeAll(async () => {
    ddbPost = await given.a_random_ddb_post();
  });

  afterAll(async () => {
    console.log("Deleting test posts in DDB");
    await deletePost("IntegrationTest", ddbPost.postId);
  });

  it("should change the publish field to true in DDB then back to false", async () => {
    await when.we_invoke_publishPost(ddbPost.author, ddbPost.postId);

    const publishedPost = await when.we_invoke_getPostById(
      "IntegrationTest",
      ddbPost.postId
    );

    expect(publishedPost).toMatchObject({
      PK: `POST#${ddbPost.author}`,
      SK: ddbPost.postId,
      title: ddbPost.title,
      content: ddbPost.content,
      author: ddbPost.author,
      created: ddbPost.created,
      updated: expect.stringMatching(
        /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/
      ),
      type: "post",
      viewCount: 0,
      published: true,
      publishDate: expect.stringMatching(
        /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/
      ),
    });

    await when.we_invoke_unpublishPost(ddbPost.author, ddbPost.postId);

    const unpublishedPost = await when.we_invoke_getPostById(
      "IntegrationTest",
      ddbPost.postId
    );

    expect(unpublishedPost).toMatchObject({
      PK: `POST#${ddbPost.author}`,
      SK: ddbPost.postId,
      title: ddbPost.title,
      content: ddbPost.content,
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
