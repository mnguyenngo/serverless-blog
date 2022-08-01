import { useContext } from "react";
import { AccountContext } from "./Accounts";
import { useLocation } from "react-router-dom";
import LoginForm from "./LoginForm";

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { loggedInUser } = useContext(AccountContext);

  let location: any = useLocation();

  if (!loggedInUser) {
    console.log(`status: not authed, redirecting to login...`);
    return <LoginForm from={location.pathname} />;
  }

  return children;
};

export default RequireAuth;
