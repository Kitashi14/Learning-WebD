/** @format */

import { createContext, useEffect, useState } from "react";

const AuthContext = createContext({
  userName: null,
  setUser : function (value){}
});

export const AuthContextProvider = (props) => {
  const [userName, setUserName] = useState(null);

  const setUser = (value)=>{
    setUserName(value);
  }

  const context = {
    userName: userName,
    setUser : setUser
  };

  return (
    <AuthContext.Provider value={context}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
