import { Outlet } from "react-router";
import "./page.css";

export default function PostPage() {
  return (
    <div className="page-content">
      <Outlet />
    </div>
  );
}
