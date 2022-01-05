import startingTheBlogPost from "./posts/startingTheBlog";

export const STARTING_THE_BLOG_URL = "deploying-react-on-aws";

interface Post {
  path: string;
  content: string;
}

export const posts: Post[] = [
  {
    path: STARTING_THE_BLOG_URL,
    content: startingTheBlogPost,
  },
];
