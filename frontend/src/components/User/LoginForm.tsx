import { useContext, useState } from "react";
import { AccountContext } from "./Accounts";
import { useNavigate } from "react-router-dom";

interface LoginFormProps {
  from?: string;
}

const LoginForm = (props: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn } = useContext(AccountContext);

  let navigate = useNavigate();
  let from = props.from || "/";

  const onSubmit = (event: any) => {
    event.preventDefault();

    signIn(email, password)
      .then((data: any) => {
        console.log("Logged in.", data);
        navigate(from, { replace: true });
      })
      .catch((err: any) => {
        console.error("Error logging in.", err);
      });
  };

  return (
    <div className="login-form">
      <h1>Login</h1>
      <form onSubmit={onSubmit} className="login-form-fields">
        <label htmlFor="name">Name: </label>
        <input
          type="text"
          id="name"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Password: </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
