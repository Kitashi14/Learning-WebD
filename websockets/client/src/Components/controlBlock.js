import { useContext } from "react";
import Navbar from "./navbar";
import OnlineUsers from "./onlineuser";
import ChatContext from "../context/chatContext";
import ChatUsers from "./chatUsers";

const ControlBlock = (props)=>{

    const chat =useContext(ChatContext);
    const chatBox = chat.chatBox;
    return (
        <>
        <div className="w-1/3 flex flex-col">
        <Navbar searchFunc={props.searchFunc}/>
        <OnlineUsers 
        users={chatBox.onlineUsers}
        openChatBox={props.openChatBox}/>
        <ChatUsers 
        searchedMsg={props.searchedMsg}
        selectedUser={props.selectedUser}
        selectedMsg={props.selectedMsg}
        users ={props.searchedUsers}
        openChatBox={props.openChatBox}
        />
        </div>
         
        </>
    );   
}

export default ControlBlock;