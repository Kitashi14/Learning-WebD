/** @format */

import ChatUserCard from "./chatUserCard";

const ChatUsers = (props) => {
  
  return (
    <>
      <div className="h-5/6 w-full bg-orange-200  flex-col space-y-2  py-2 overflow-y-scroll ">
        {props.users.map((user) => {
          return (
            <ChatUserCard key={user.userName} user={user} openChatBox={props.openChatBox}/>
          );
        })}
      </div>
    </>
  );
};

export default ChatUsers;
