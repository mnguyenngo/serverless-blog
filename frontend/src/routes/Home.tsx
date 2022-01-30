import { Link } from "react-router-dom";
import { SECURE_AND_CUSTOM_DOMAIN, STARTING_THE_BLOG_URL } from "../constants";
import "./page.css";

export default function Home() {
  return (
    <div className="page-content">
      <h1>Posts</h1>
      <div className="post-title">
        <span>2022 February - </span>
        <Link to={`/post/${SECURE_AND_CUSTOM_DOMAIN}`} className="post-link">
          Adding a custom domain and securing the blog
        </Link>
      </div>
      <div className="post-title">
        <span>2022 January - </span>
        <Link to={`/post/${STARTING_THE_BLOG_URL}`} className="post-link">
          Deploying a blog with AWS CDK and S3
        </Link>
      </div>
    </div>
  );
}
