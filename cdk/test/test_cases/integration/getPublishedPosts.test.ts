// export {}; // https://bobbyhadz.com/blog/typescript-cannot-redeclare-block-scoped-variable
import deletePost from "../../../post-lambda/deletePost";
const given = require("../../steps/given");
const when = require("../../steps/when");

describe("When getPosts is invoked", () => {
  let firstPost: any;
  let secondPost: any;

  beforeAll(async () => {
    firstPost = await given.a_random_ddb_post();
    await when.we_invoke_publishPost(firstPost.author, firstPost.postId);
    secondPost = await given.a_random_ddb_post();
  });

  afterAll(async () => {
    console.log("Deleting test posts in DDB");

    for (const post of [firstPost, secondPost]) {
      await deletePost(given.TEST_AUTHOR, post.postId);
    }
  });

  it("should return only published posts from the author", async () => {
    const posts = await when.we_invoke_getPublishedPosts(given.TEST_AUTHOR);

    // NOTE: the result from invoking getPosts includes DDB fields such as PK and SK
    // This test still passes
    expect(posts).toMatchObject([
      {
        ...firstPost,
        updated: expect.stringMatching(
          /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/
        ),
        publishDate: expect.stringMatching(
          /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/
        ),
        published: true,
      },
    ]);
  });
});
