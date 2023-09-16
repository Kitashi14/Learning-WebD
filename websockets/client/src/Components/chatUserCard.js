/** @format */

import { useContext } from "react";
import AuthContext from "../context/authContext";
import ChatContext from "../context/chatContext";

const ChatUserCard = (props) => {
  const user = props.user;
  const userName = useContext(AuthContext).userName;
  const chat = useContext(ChatContext);
  const date = new Date(user.latestMessage);
  const lastDay = (date) => {
    const currDate = new Date();
    if (
      date.getFullYear() == currDate.getFullYear() &&
      date.getMonth() == currDate.getMonth()
    ) {
      if (date.getDate() == currDate.getDate()) return "Today";
      else if (date.getDate() + 1 == currDate.getDate()) return "Yesterday";
      else
        return `${
          date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
        }/${
          date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth()
        }/${date.getFullYear()}`;
    } else {
      return `${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}/${
        date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth()
      }/${date.getFullYear()}`;
    }
  };

  const getTime = (date)=>{
    var hour = date.getHours();
    const part = (hour>12) ? "pm":"am";
    hour = (hour>12) ? hour-12 : hour;
    const min = date.getMinutes();
    return (
      `${
        hour < 10 ? `0${hour}` : hour
      }:${
        min < 10
          ? `0${min}`
          : min
      } ${part}`
    );
  }
  const openUser = (e) => {
    e.preventDefault();
    props.openChatBox(user.userName);
  };
  return (
    <button
      onClick={openUser}
      value={user.userName}
      className="h-24 w-full bg-blue-200 flex flex-row border border-green-800"
    >
      <div className=" w-4/5 h-full flex flex-col pl-4 py-2 items-start space-y-2">
        <span className="text-green-800 text-3xl font-bold font-sans">
          {user.userName}
          <span className="ml-3 text-sm text-red-800  font-medium italic">{(chat.userTyping===user.userName) ? "is typing....": ""}</span>
        </span>
        <span className="text-green-800 text-xl italic pl-2 font-serif truncate">
          {user.messages.length
            ? `${
                user.messages[user.messages.length - 1].to === userName
                  ? user.userName
                  : "You"
              }: ${user.messages[user.messages.length - 1].message}`
            : "lores ipsum"}
        </span>
      </div>
      <div className="w-1/5 h-full  flex flex-col  pr-4 py-2 space-y-2 items-end">
        <span className="text-blue-800 font-mono">
          {user.latestMessage
            ? lastDay(date)
            : ""}
        </span>
        <span className="text-blue-800 font-mono">
          {user.latestMessage
            ? getTime(date)
            : ""}
        </span>
      </div>
    </button>
  );
};

export default ChatUserCard;
