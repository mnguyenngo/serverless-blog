import { Link } from "react-router-dom";
import { STARTING_THE_BLOG_URL } from "../constants";
import "./page.css";

export default function Home() {
  return (
    <div className="page-content">
      <h1>Posts</h1>
      <div className="post-title">
        <span>2022 January - </span>
        <Link to={`/post/${STARTING_THE_BLOG_URL}`} className="post-link">
          Deploying a blog with AWS CDK and S3
        </Link>
      </div>
    </div>
  );
}
