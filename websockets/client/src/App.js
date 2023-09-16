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
  const [showUsers,setShowUsers] = useState(chatBox.users);

  const searchedUsers = (text)=>{
    const searchResult = chatBox.users.filter((user)=>{
      return (user.userName.includes(text));
    })
    setShowUsers(searchResult);
  }
  return (
    <>
      <ToastContainer
        autoClose={1000}
        position={toast.POSITION.BOTTOM_RIGHT}
        hideProgressBar
        theme="light"
      />
      <div className="h-screen">
        <Navbar searchFunc={searchedUsers}/>
        <ChatPage searchedUsers={showUsers}/>
      </div>
    </>
  );
}

export default App;
