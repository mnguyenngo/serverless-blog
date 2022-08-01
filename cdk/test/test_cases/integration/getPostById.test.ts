// export {}; // https://bobbyhadz.com/blog/typescript-cannot-redeclare-block-scoped-variable
import deletePost from "../../../post-lambda/deletePost";
const given = require("../../steps/given");
const when = require("../../steps/when");

describe("When getPostById is invoked", () => {
  let ddbPost: any;

  beforeAll(async () => {
    ddbPost = await given.a_random_ddb_post();
  });

  afterAll(async () => {
    console.log("Deleting test posts in DDB");
    await deletePost("IntegrationTest", ddbPost.postId);
  });

  it("should return the post with the given id", async () => {
    console.log(`ddbPost: ${JSON.stringify(ddbPost, null, 2)}`);

    const post = await when.we_invoke_getPostById(
      "IntegrationTest",
      ddbPost.postId
    );

    console.log(`got post: ${JSON.stringify(post, null, 2)}`);

    // NOTE: the result from invoking getPostById includes DDB fields such as PK and SK
    // This test still passes
    expect(post).toMatchObject(ddbPost);
  });
});
