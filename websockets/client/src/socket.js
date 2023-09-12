/** @format */

import { useContext, useEffect } from "react";
import ChatContext from "./context/chatContext";
import AuthContext from "./context/authContext";
import { socket } from "./sc";

export const useSocket = () => {
  const chat = useContext(ChatContext);
  const auth = useContext(AuthContext);

  useEffect(() => {
    if (auth.userName) {
      socket.on("joined", (data) => {
        console.log("new user joined : ", data);
        const currObj = chat.chatBox;
        currObj.addOnlineUser(data);
        chat.setChatBox(currObj);
      });

      socket.on("left", (user)=>{
        console.log("user left", user);
        const currObj = chat.chatBox;
        currObj.removeOnlineUser(user);
        chat.setChatBox(currObj);
      })

      socket.on("initial info", (data) => {
        console.log("got initial info : ", data);
        const currObj = chat.chatBox;
        if (data.onlineUsers.length) {
          data.onlineUsers.map((user) => {
            currObj.addOnlineUser(user);
          });
        }
        currObj.addData(auth.userName,data.oldData);
        chat.setChatBox(currObj);
      });

      socket.on("server received message",(data)=>{
        console.log("server received message");
        const currObj = chat.chatBox;
        currObj.addMessage(data.data.to,data.data);
        chat.setChatBox(currObj);
      });

      socket.on("new message",(data)=>{
        console.log("new message received");
        const currObj = chat.chatBox;
        currObj.addMessage(data.from,data);
        chat.setChatBox(currObj);
      })

      return () => {
        socket.off("joined");
        socket.off("online users info");
        socket.off("server received message");
        socket.off("new message");
      };
    }
  }, [auth.userName]);
};
