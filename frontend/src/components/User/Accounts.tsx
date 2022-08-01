import { createContext, ReactNode, useState } from "react";
import { CognitoUser } from "amazon-cognito-identity-js";
import { Auth } from "aws-amplify";

interface AccountContextType {
  loggedInUser: CognitoUser | null;
  resetCurrentAuthedUser: () => Promise<any>;
  signIn: (username: string, password: string) => Promise<any>;
  signOut: (callback: VoidFunction) => Promise<any>;
}

const AccountContext = createContext<AccountContextType>(null!);

const Account = ({ children }: { children: ReactNode }) => {
  const [loggedInUser, setLoggedInUser] = useState<any>(null);

  const resetCurrentAuthedUser = async () => {
    if (!loggedInUser) {
      const user = await Auth.currentAuthenticatedUser();
      if (user) {
        setLoggedInUser(user);
      }
    }

    // console.log(`resetCurrentAuthedUser: ${JSON.stringify(user, null, 2)}`);
  };

  const signIn = async (username: string, password: string) => {
    try {
      const user = await Auth.signIn(username, password);
      setLoggedInUser(user);
    } catch (err) {
      console.log(`signIn error: ${err}`);
    }
  };

  const signOut = async (callback: VoidFunction) => {
    try {
      await Auth.signOut();
      setLoggedInUser(null);
      callback();
    } catch (err) {
      console.log(`signOut error: ${err}`);
    }
  };

  let value = {
    loggedInUser,
    resetCurrentAuthedUser,
    signIn,
    signOut,
  };

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
};

export { Account, AccountContext };
