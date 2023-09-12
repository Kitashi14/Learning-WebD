/** @format */

import { useContext, useRef, useState } from "react";
import { toast } from "react-toastify";
import AuthContext from "../context/authContext";

const Navbar = () => {
  const userInputRef = useRef();

  const auth = useContext(AuthContext);

  const setUser = () => {
    const user = userInputRef.current.value;
    if (!user) {
      toast.error("Enter user name");
      return;
    }
    auth.setUser(user);
  };
  return (
    <>
      <div className="h-1/6">
        <div className="py-2 w-full h-full bg-red-600 text-white text-xl font-bold flex flex-col justify-center items-center">
          {auth.userName ? (
            <>
              <span className="my-2">{`User : ${auth.userName}`}</span>
            </>
          ) : (
            <>
              <input
                ref={userInputRef}
                type="text"
                className="w-1/4 px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none mb-2 focus:outline-none focus:shadow-outline"
              />
              <button
                className="px-4 py-1 border rounded-lg font-normal bg-green-600 text-white"
                onClick={setUser}
              >
                Set User
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
