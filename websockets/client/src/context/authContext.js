/** @format */

import { createContext, useEffect, useReducer, useState } from "react";

const AuthContext = createContext({
  userName: null,
  setUser : function (value){}
});

export const AuthContextProvider = (props) => {
  const [userName, setUserName] = useState(null);
  const [_, forceRender] = useReducer((x) => !x, false);

  const setUser = (value)=>{
    setUserName(value);
    forceRender();
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
