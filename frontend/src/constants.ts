import startingTheBlogPost from "./posts/startingTheBlog";
import secureCustomDomain from "./posts/secureCustomDomain";

export const STARTING_THE_BLOG_URL = "deploying-react-on-aws";
export const SECURE_AND_CUSTOM_DOMAIN = "secure-custom-domain";

interface Post {
  path: string;
  content: string;
}

export const posts: Post[] = [
  {
    path: STARTING_THE_BLOG_URL,
    content: startingTheBlogPost,
  },
  {
    path: SECURE_AND_CUSTOM_DOMAIN,
    content: secureCustomDomain,
  },
];
