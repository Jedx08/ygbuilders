import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [userInfo, setUserInfo] = useState({});

  return (
    <AuthContext.Provider value={{ auth, setAuth, userInfo, setUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
