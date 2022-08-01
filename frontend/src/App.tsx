import { Account } from "./components/User/Accounts";
import { Routes, Route, Outlet } from "react-router-dom";
import About from "./routes/About";
import Admin from "./routes/Admin";
import Home from "./routes/Home";
import Login from "./routes/Login";
import PostPage from "./routes/PostPage";
import PostContent from "./components/PostContent/PostContent";
import Header from "./components/Header/Header";
import RequireAuth from "./components/User/RequireAuth";
import NewPage from "./routes/NewPage";
import EditPage from "./routes/EditPage";
import ReadonlyPage from "./routes/ReadonlyPage";
import { posts } from "./constants";
import "./App.css";

import { awsconfig } from "./aws-exports";
import { Amplify } from "aws-amplify";
Amplify.configure(awsconfig);

const App = () => {
  return (
    <Account>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="about/" element={<About />} />
          <Route path="markdown-post/" element={<PostPage />}>
            {posts.map((post) => {
              return (
                <Route
                  key={post.path}
                  path={post.path}
                  element={<PostContent content={post.content} />}
                />
              );
            })}
          </Route>
          <Route
            path="admin/"
            element={
              <RequireAuth>
                <Admin />
              </RequireAuth>
            }
          />
          <Route
            path="newpage/"
            element={
              <RequireAuth>
                <NewPage />
              </RequireAuth>
            }
          />
          <Route
            path="editpage/:postId"
            element={
              <RequireAuth>
                <EditPage />
              </RequireAuth>
            }
          />
          <Route path="post/:postId" element={<ReadonlyPage />} />
          <Route path="login/" element={<Login />} />
        </Route>
      </Routes>
    </Account>
  );
};

export default App;

const Layout = () => {
  return (
    <div className="app-container">
      <Header />
      <Outlet />
    </div>
  );
};
