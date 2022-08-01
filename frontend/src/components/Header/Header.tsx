import { Link } from "react-router-dom";
import Status from "../User/Status";
import "./Header.css";

export default function Header() {
  return (
    <div className="header-container">
      <Status />
      <div className="header-content">
        <Link to="/" className="title-link">
          <h2>Nguyen Ngo</h2>
        </Link>
        <nav className="nav-links">
          <Link to="/" className="nav-link">
            Blog
          </Link>
          <Link to="/about" className="nav-link">
            About
          </Link>
          <a
            href="https://github.com/mnguyenngo/serverless-blog"
            className="nav-link"
          >
            Github
          </a>
        </nav>
      </div>
    </div>
  );
}
