import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ddbDeletePost, ddbGetPosts, ddbTogglePublish, Post } from "../grapql";
import "./page.css";

const Admin = () => {
  let navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const posts = await ddbGetPosts();
      setPosts(posts);
    };
    fetchPosts();
  }, []);

  const handleDeletePost = async (postId: string) => {
    ddbDeletePost(postId);
    const newPosts = posts.filter((post) => post.postId !== postId);
    setPosts(newPosts);
  };

  const handleTogglePublish = async (postId: string, published: boolean) => {
    const updatedPost = await ddbTogglePublish(postId, published);
    const updatedPosts = posts.map((post) => {
      if (post.postId === postId) {
        return updatedPost;
      }
      return post;
    });
    setPosts(updatedPosts);
  };

  return (
    <>
      <div className="page-content">
        <h1>Admin</h1>
        <div className="admin-content">
          <button onClick={() => navigate("/newpage")}>New Page</button>
          <div>
            <h2>Posts</h2>
            <ul>
              {posts.map((post: Post) => {
                return (
                  <li key={post.postId}>
                    <Link to={`/post/${post.postId}`}>
                      {post.title} -{" "}
                      {post.published
                        ? `Published on ${post.publishDate}`
                        : "Draft"}
                    </Link>
                    <button onClick={() => handleDeletePost(post.postId)}>
                      Delete
                    </button>
                    <input
                      checked={post.published}
                      type="checkbox"
                      id="publish-post"
                      onChange={() =>
                        handleTogglePublish(post.postId, post.published)
                      }
                    />
                    <label htmlFor="publish-post">
                      {post.published ? "Published" : "Publish"}
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
