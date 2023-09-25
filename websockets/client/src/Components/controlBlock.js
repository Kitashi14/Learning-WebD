/** @format */

import { useContext } from "react";
import Navbar from "./navbar";
import OnlineUsers from "./onlineuser";
import ChatContext from "../context/chatContext";
import ChatUsers from "./chatUsers";

const ControlBlock = (props) => {
  const chat = useContext(ChatContext);
  const chatBox = chat.chatBox;
  const onlineUsers = chatBox.onlineUsers;
  return (
    <>
      <div className="w-1/3 flex flex-col">
        <Navbar searchFunc={props.searchFunc} />
        {onlineUsers.length ? (
          <>
            <OnlineUsers users={onlineUsers} openChatBox={props.openChatBox} />
          </>
        ) : (
          <></>
        )}

        <ChatUsers
          searchedMsg={props.searchedMsg}
          selectedUser={props.selectedUser}
          selectedMsg={props.selectedMsg}
          users={props.searchedUsers}
          openChatBox={props.openChatBox}
        />
      </div>
    </>
  );
};

export default ControlBlock;
