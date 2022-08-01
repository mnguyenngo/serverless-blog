import { Outlet } from "react-router";
import "./page.css";

const PostPage = () => {
  return (
    <div className="page-content">
      <Outlet />
    </div>
  );
};

export default PostPage;
