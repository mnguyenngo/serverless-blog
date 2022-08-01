import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AccountContext } from "./Accounts";
import "./User.css";

const Status = () => {
  const { loggedInUser, resetCurrentAuthedUser, signOut } =
    useContext(AccountContext);
  let navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      await resetCurrentAuthedUser();
    };
    if (!loggedInUser) {
      checkAuth();
    }
  }, [loggedInUser, resetCurrentAuthedUser]);

  return (
    <div className="status-container">
      {loggedInUser && (
        <div className="login-status">
          <button
            className="admin-page-link"
            onClick={() => navigate("/admin")}
          >
            Admin
          </button>
          <div>
            <button onClick={() => signOut(() => navigate("/"))}>Logout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Status;
