/** @format */

import Navbar from "./Components/navbar";
import ChatPage from "./chatPage";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useSocket } from "./socket";
import { useContext, useState } from "react";
import ChatContext from "./context/chatContext";

function App() {
  useSocket();
  const chatBox = useContext(ChatContext).chatBox;
  const [showUsers, setShowUsers] = useState(chatBox.users);
  const [searchedMsg, setSearchedMsg] = useState([]);

  const searchedUsers = (text) => {
    var msgs = [];
    const searchResult = chatBox.users.filter((user) => {
      user.messages.map((msg) => {
        if (text.length)
          if (msg.message.includes(text)) {
            msgs.push({
              userName: user.userName,
              message: msg,
            });
          }
      });
      return user.userName.includes(text);
    });
    setShowUsers(searchResult);
    msgs.sort((a,b)=>{
      var timeA = new Date(a.message.time);
      timeA=timeA.getTime();
      var timeB = new Date(b.message.time);
      timeB=timeB.getTime();
      return timeB-timeA;
    })
    setSearchedMsg(msgs);
  };
  return (
    <>
      <ToastContainer
        autoClose={1000}
        position={toast.POSITION.BOTTOM_RIGHT}
        hideProgressBar
        theme="light"
      />
      <div className="h-screen">
        <Navbar searchFunc={searchedUsers} />
        <ChatPage searchedUsers={showUsers} searchedMsg={searchedMsg} />
      </div>
    </>
  );
}

export default App;
