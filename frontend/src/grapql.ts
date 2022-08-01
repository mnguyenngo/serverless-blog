import { API } from "aws-amplify";

export type Post = {
  author: string;
  content: string;
  title: string;
  postId: string;
  titleSlug: string;
  created: string;
  updated: string;
  viewCount: number;
  publishDate: string | null;
  published: boolean;
};

// ===========
// CREATE POST
// ===========

export type SavePostProps = {
  title: string;
  content: string;
  postId?: string;
};

const createPostQuery = `
  mutation createPost($post: PostInput!) {
    createPost(post: $post) {
      author
      content
      created
      postId
      publishDate
      published
      title
      updated
      titleSlug
      viewCount
    }
  }
`;

const ddbSavePost = async (post: SavePostProps) => {
  // const contentString = JSON.stringify(value).replace(/"/g, '\\"');
  const contentString = JSON.stringify(post.content);
  // console.log(`contentString: ${contentString}`);
  const resp = await API.graphql({
    query: createPostQuery,
    variables: {
      post: {
        author: "Nguyen",
        title: post.title,
        content: contentString,
      },
    },
    authMode: "AMAZON_COGNITO_USER_POOLS",
  });
  console.log(`data from GraphQL: ${JSON.stringify(resp, null, 2)}`);
};

// ==============
// GET POST BY ID
// ==============

const getPostQuery = `
    query getPostById($postId: String!) {
      getPostById(author: "Nguyen", postId: $postId) {
        author
        content
        created
        postId
        publishDate
        published
        title
        titleSlug
        updated
        viewCount
      }
    }
  `;

const ddbGetPost = async (postId: string) => {
  const resp = await API.graphql({
    query: getPostQuery,
    variables: {
      postId: postId,
    },
    authMode: "API_KEY",
  });
  // console.log(`data from GraphQL: ${JSON.stringify(resp, null, 2)}`);
  // @ts-ignore
  const post = resp.data.getPostById;
  // console.log(`post.content: ${post.content}`);
  return post;
};

// =========
// GET POSTS
// =========

const getPostsQuery = `
  query getPosts {
    getPosts(author: "Nguyen") {
      author
      created
      postId
      publishDate
      published
      title
      titleSlug
      updated
      viewCount
    }
  }
`;

const ddbGetPosts = async () => {
  const resp = await API.graphql({
    query: getPostsQuery,
    authMode: "AMAZON_COGNITO_USER_POOLS",
  });
  console.log(`data from GraphQL: ${JSON.stringify(resp, null, 2)}`);
  // @ts-ignore
  return resp.data.getPosts;
};

// ===================
// GET PUBLISHED POSTS
// Publicly accessible
// ===================

const getPublishedPostsQuery = `
  query getPublishedPosts {
    getPublishedPosts(author: "Nguyen") {
      author
      created
      postId
      publishDate
      published
      title
      titleSlug
      updated
      viewCount
    }
  }
`;

const ddbGetPublishedPosts = async () => {
  const resp = await API.graphql({ query: getPublishedPostsQuery });
  console.log(`data from GraphQL: ${JSON.stringify(resp, null, 2)}`);
  // @ts-ignore
  return resp.data.getPublishedPosts;
};

// ===========
// UPDATE POST
// ===========

const updatePostQuery = `
    mutation updatePost($author: String!, $postId: String!, $post: PostInput!) {
      updatePost(author: $author, postId: $postId, post: $post) {
        author
        content
        created
        postId
        publishDate
        published
        title
        updated
        titleSlug
        viewCount
      }
    }
  `;

const ddbUpdatePost = async (post: SavePostProps) => {
  const contentString = JSON.stringify(post.content);
  // console.log(`contentString: ${contentString}`);
  const resp = await API.graphql({
    query: updatePostQuery,
    variables: {
      author: "Nguyen",
      postId: post.postId,
      post: {
        author: "Nguyen",
        title: post.title,
        content: contentString,
      },
    },
    authMode: "AMAZON_COGNITO_USER_POOLS",
  });
  console.log(`data from GraphQL: ${JSON.stringify(resp, null, 2)}`);
  // TODO: log resp code here
};

// ===========
// DELETE POST
// ===========

const deleteQuery = `
  mutation deletePost($author: String!, $postId: String!) {
    deletePost(author: $author, postId: $postId)
  }
`;

const ddbDeletePost = async (postId: string) => {
  console.log(`delete called for post ${postId}`);
  const resp = await API.graphql({
    query: deleteQuery,
    variables: {
      author: "Nguyen",
      postId,
    },
    authMode: "AMAZON_COGNITO_USER_POOLS",
  });
  // console.log(`data from GraphQL: ${JSON.stringify(resp, null, 2)}`);
  // @ts-ignore
  console.log(`successfully deleted postId: ${resp.data.deletePost}`);
};

// ======================
// PUBLISH/UNPUBLISH POST
// ======================

const publishQuery = `
  mutation publishPost($author: String!, $postId: String!) {
    publishPost(author: $author, postId: $postId) {
      postId
      publishDate
      published
      title
      titleSlug
    }
  }
`;

const unpublishQuery = `
  mutation unpublishPost($author: String!, $postId: String!) {
    unpublishPost(author: $author, postId: $postId) {
      postId
      publishDate
      published
      title
      titleSlug
    }
  }
`;

const ddbTogglePublish = async (postId: string, published: boolean) => {
  console.log(
    `toggle publish called for post ${postId} with published: ${published}`
  );

  const correctPublishQuery = published ? unpublishQuery : publishQuery;

  const resp = await API.graphql({
    query: correctPublishQuery,
    variables: {
      author: "Nguyen",
      postId,
    },
    authMode: "AMAZON_COGNITO_USER_POOLS",
  });

  const updatedPost = published
    ? // @ts-ignore
      resp.data.unpublishPost
    : // @ts-ignore
      resp.data.publishPost;

  console.log(
    `successfully toggled publish postId: ${JSON.stringify(resp, null, 2)}`
  );

  return updatedPost;
};

export {
  ddbSavePost,
  ddbGetPosts,
  ddbGetPublishedPosts,
  ddbGetPost,
  ddbUpdatePost,
  ddbDeletePost,
  ddbTogglePublish,
};
