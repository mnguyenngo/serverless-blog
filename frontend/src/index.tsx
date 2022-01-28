import { render } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import About from "./routes/About";
import Home from "./routes/Home";
import PostPage from "./routes/PostPage";
import PostContent from "./components/PostContent/PostContent";
import { posts } from "./constants";
import "./index.css";

const rootElement = document.getElementById("root");

render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="/" element={<Home />} />
        <Route path="about/" element={<About />} />
        <Route path="post/" element={<PostPage />}>
          {posts.map((post) => {
            return (
              <Route
                path={post.path}
                element={<PostContent content={post.content} />}
              />
            );
          })}
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>,
  rootElement
);
