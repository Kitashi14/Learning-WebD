/** @format */

import ChatUserCard from "./chatUserCard";
import SearchedMsgCard from "./searchedMsgCard";

const ChatUsers = (props) => {
  return (
    <>
      <div className="h-5/6 w-full bg-orange-200  flex-col space-y-2  py-2 overflow-y-scroll ">
        {props.users.map((user) => {
          return (
            <ChatUserCard
              key={user.userName}
              user={user}
              openChatBox={props.openChatBox}
            />
          );
        })}
        {props.searchedMsg.length ? (
          <>
            <div className="h-10 w-full bg-blue-400 flex flex-row border border-blue-800 text-xl px-4 font-bold">
              Chat:
            </div>
            {props.searchedMsg.map((data) => {
          return (
            <SearchedMsgCard
              key={data.message._id}
              searchedMsg={data}
              openChatBox={props.openChatBox}
            />
          );
        })}
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default ChatUsers;
