import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SECURE_AND_CUSTOM_DOMAIN, STARTING_THE_BLOG_URL } from "../constants";
import { ddbGetPublishedPosts, Post } from "../grapql";
import "./page.css";

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const posts = await ddbGetPublishedPosts();
      setPosts(posts);
    };
    fetchPosts();
  }, []);

  return (
    <div className="page-content">
      <h1>Posts</h1>
      <ul className="post-list">
        {posts.map((post: Post) => {
          return (
            <li key={post.postId} className="post-title">
              {post.publishDate?.split("T")[0]} -{" "}
              <Link to={`/post/${post.postId}`}>
                {post.title}
              </Link>
            </li>
          );
        })}
      </ul>
      <h2>Markdown Posts</h2>
      <div className="post-title">
        <span>2022 February - </span>
        <Link to={`/markdown-post/${SECURE_AND_CUSTOM_DOMAIN}`} className="post-link">
          Adding a custom domain and securing the blog
        </Link>
      </div>
      <div className="post-title">
        <span>2022 January - </span>
        <Link to={`/markdown-post/${STARTING_THE_BLOG_URL}`} className="post-link">
          Deploying a blog with AWS CDK and S3
        </Link>
      </div>
    </div>
  );
};

export default Home;
