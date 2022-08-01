// export {};
const chance = require("chance").Chance();
import createPost from "../../post-lambda/createPost";
import { PostInput } from "../../post-lambda/Post";

const TEST_AUTHOR = "IntegrationTest";

const a_random_post_input = () => {
  const title = chance.sentence({ words: 4 });
  const content = chance.paragraph({ sentences: 3 });
  const author = TEST_AUTHOR;

  const postInput: PostInput = {
    title,
    content,
    author,
  };

  return postInput;
};

const a_random_ddb_post = async () => {
  const postInput: PostInput = a_random_post_input();
  const post = await createPost(postInput);
  return post;
};

export { a_random_post_input, a_random_ddb_post, TEST_AUTHOR };
// module.exports = { a_random_post_input };
