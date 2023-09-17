/** @format */

import { useContext, useState } from "react";
import ChatContext from "./context/chatContext";
import OnlineUsers from "./Components/onlineuser";
import ChatBox from "./Components/chatBox";
import ChatUsers from "./Components/chatUsers";
import { socket } from "./sc";

const ChatPage = (props) => {
  const [isChatBoxOpen, setChatBoxOpen] = useState(false);
  const [isSelectedUserOld, setIsSelectedUserOld] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserName,setSelectedUserName] = useState(null);
  const [selectedMsg,setSelectedMsg] = useState(null);
  
  const chat = useContext(ChatContext);
  const chatBox = chat.chatBox;

  if(isChatBoxOpen && selectedUserName){
    var user = chat.chatBox.isUserPresent(selectedUserName);
    if (!isSelectedUserOld && user) {
      setIsSelectedUserOld(true);
      setSelectedUser(user);
    }
  }

  const openChatBox = (userName,message_id) => {
    if(message_id){
      setSelectedMsg(message_id);
    }
    else{
      setSelectedMsg(null);
    }
    setSelectedUserName(userName);
    var user = chat.chatBox.isUserPresent(userName);
    if (user) {
      setIsSelectedUserOld(true);
      setSelectedUser(user);
      var currObj = chat.chatBox;
      currObj.meSaw(userName);
      chat.setChatBox(currObj);
    } else {
      setIsSelectedUserOld(false);
      setSelectedUser(userName);
    }
    setChatBoxOpen(true);
    chat.setChatScreenUser(userName);
    socket.emit("seen",userName);
  };

  const closeChatBox = () => {
    setSelectedUserName(null);
    setIsSelectedUserOld(false);
    setSelectedUser(null);
    setChatBoxOpen(false);
    chat.setChatScreenUser(null);
  };

  return (
    <>
      <div className="h-5/6 w-full">
        {isChatBoxOpen ? (
          <ChatBox
            closeChatBox={closeChatBox}
            isOld={isSelectedUserOld}
            userInfo={selectedUser}
            selectedMsg={selectedMsg}
          />
        ) : (
          <>
            <OnlineUsers
              users={chatBox.onlineUsers}
              openChatBox={openChatBox}
            />
            <ChatUsers searchedMsg={props.searchedMsg} users={props.searchedUsers} openChatBox={openChatBox}/>
          </>
        )}
      </div>
    </>
  );
};

export default ChatPage;
