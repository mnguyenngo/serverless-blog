import createPost from "./createPost";
import deletePost from "./deletePost";
import getPostById from "./getPostById";
import getPosts from "./getPosts";
import getPublishedPosts from "./getPublishedPosts";
import { PostInput } from "./Post";
import setPublish from "./publishPost";
import updatePost from "./updatePost";

type AppSyncEvent = {
  info: {
    fieldName: string;
  };
  arguments: {
    author: string;
    postId: string;
    post: PostInput;
  };
};

exports.handler = async (event: AppSyncEvent) => {
  switch (event.info.fieldName) {
    case "getPostById":
      return await getPostById(event.arguments.author, event.arguments.postId);
    case "getPosts":
      return await getPosts(event.arguments.author);
    case "getPublishedPosts":
      return await getPublishedPosts(event.arguments.author);
    case "createPost":
      return await createPost(event.arguments.post);
    case "updatePost":
      return await updatePost(
        event.arguments.author,
        event.arguments.postId,
        event.arguments.post
      );
    case "deletePost":
      return await deletePost(event.arguments.author, event.arguments.postId);
    case "publishPost":
      return await setPublish(
        event.arguments.author,
        event.arguments.postId,
        true
      );
    case "unpublishPost":
      return await setPublish(
        event.arguments.author,
        event.arguments.postId,
        false
      );
    default:
      throw new Error(`Unknown field name: ${event.info.fieldName}`);
  }
};
