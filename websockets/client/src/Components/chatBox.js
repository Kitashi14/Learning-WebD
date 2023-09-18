/** @format */

import { useContext, useEffect, useRef, useState } from "react";
import ChatContext from "../context/chatContext";
import AuthContext from "../context/authContext";
import { socket } from "../sc";

const ChatBox = (props) => {
  const chatInputRef = useRef();
  const chat = useContext(ChatContext);
  const auth = useContext(AuthContext);
  const selectedMsgRef = useRef();
  const scrollBlock = useRef();
  const [scrollDownButton, setScrollDownButton] = useState(false);

  const getDay = (date) => {
    date = new Date(date);
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

  const getTime = (date) => {
    date = new Date(date);
    var hour = date.getHours();
    const part = hour > 12 ? "pm" : "am";
    hour = hour > 12 ? hour - 12 : hour;
    const min = date.getMinutes();
    return `${hour < 10 ? `0${hour}` : hour}:${
      min < 10 ? `0${min}` : min
    } ${part}`;
  };

  const scrollHandler = (e) => {
    e.preventDefault();
    if (scrollBlock.current.scrollTop < 0) {
      setScrollDownButton(true);
    } else {
      setScrollDownButton(false);
    }
  };

  const showSelectedMsg = () => {
    selectedMsgRef.current?.scrollIntoView({ block: "center" });
  };

  useEffect(() => {
    if (scrollBlock.current.scrollTop < 0) {
      setScrollDownButton(true);
    } else {
      setScrollDownButton(false);
    }
    showSelectedMsg();
  }, [props.selectedMsg]);

  const userName = props.isOld ? props.userInfo.userName : props.userInfo;

  const statusIcon = (status) => {
    if (status === "delivered") {
      return (
        <svg
          className=" m-auto ml-2 mr-1"
          xmlns="http://www.w3.org/2000/svg"
          height="1em"
          viewBox="0 0 448 512"
        >
          <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
        </svg>
      );
    } else if (status === "received") {
      return (
        <svg
          className=" m-auto ml-2 mr-1"
          xmlns="http://www.w3.org/2000/svg"
          height="1em"
          viewBox="0 0 512 512"
        >
          <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z" />
        </svg>
      );
    } else if (status == "seen") {
      return (
        <svg
          className=" m-auto ml-2 mr-1"
          xmlns="http://www.w3.org/2000/svg"
          height="1em"
          viewBox="0 0 512 512"
        >
          <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
        </svg>
      );
    } else {
      return (
        <svg
          className="fill-red-600 m-auto ml-2 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          height="1em"
          viewBox="0 0 384 512"
        >
          <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
        </svg>
      );
    }
  };

  // const backButtonHandler = () => {
  //   props.closeChatBox();
  // };

  const sendButtonHandler = async () => {
    const chatInput = chatInputRef.current.value;

    if (chatInput) {
      var currObj = chat.chatBox;
      await currObj.send(auth.userName, userName, chatInput);
      chat.setChatBox(currObj);
      chatInputRef.current.value = "";
    }
    return;
  };
  var messages = [];
  if (props.isOld && props.userInfo.messages.length) {
    messages = JSON.parse(JSON.stringify(props.userInfo.messages));
    messages.reverse();
  }

  var currDate;
  if (messages.length) {
    currDate = getDay(messages[0].time);
  }

  const setTyping = () => {
    socket.emit("typing", {
      typer: auth.userName,
      for: userName,
    });
  };

  return (
    <>
      <div className="bg-orange-200 flex flex-col h-full w-2/3">
        <div className="h-1/6 flex flex-row pl-2 items-center text-blue-600 text-xl font-bold bg-green-300 ">
          {/* <button
            className="border bg-green-600 text-white py-1 px-3 font-medium rounded shadow"
            onClick={backButtonHandler}
          >
            Back
          </button> */}
          <span className="ml-5">{`${userName}`}</span>
          <span className="ml-5 text-m text-red-800 underline font-medium italic">
            {chat.userTyping ? "is typing...." : ""}
          </span>
        </div>
        <div
          className="bg-white h-4/6 flex flex-col-reverse space-y-1 py-1 px-2 overflow-scroll overflow-x-hidden "
          onScroll={scrollHandler}
          ref={scrollBlock}
        >
          {props.isOld && props.userInfo.messages.length ? (
            <>
              {messages.map((message) => {
                var setDay = false;
                var prevDay = "";
                var msgDay = getDay(message.time);
                if (msgDay !== currDate) {
                  prevDay = currDate;
                  currDate = msgDay;
                  setDay = true;
                }
                if (message.to === userName) {
                  return (
                    <>
                      {setDay ? (
                        <>
                          <div className="flex flex-row justify-center">
                            <span className="w-1/3 bg-green-400 text-center py-1 rounded">
                              {prevDay}
                            </span>
                          </div>
                        </>
                      ) : (
                        <>{/* <div>set day</div> */}</>
                      )}
                      <div
                        key={message._id}
                        ref={
                          props.selectedMsg === message._id
                            ? selectedMsgRef
                            : null
                        }
                        className={`w-full ${
                          props.selectedMsg === message._id
                            ? "bg-red-200 rounded"
                            : ""
                        } flex flex-row justify-end mt-1 `}
                      >
                        <span className="max-w-screen-md bg-red-400 rounded">
                          <div className=" flex flex-row rounded pl-6 ">
                            {message.message}
                            {statusIcon(message.status)}
                          </div>
                          <div className="flex flex-row justify-end pr-1  text-red-800 text-[10px]">
                            {getTime(message.time)}
                          </div>
                        </span>
                      </div>
                    </>
                  );
                } else {
                  return (
                    <>
                      {setDay ? (
                        <>
                          <div className="flex flex-row justify-center">
                            <span className="w-1/3 bg-green-400 text-center py-1 rounded">
                              {prevDay}
                            </span>
                          </div>
                        </>
                      ) : (
                        <>{/* <div>set day</div> */}</>
                      )}
                      <div
                        key={message._id}
                        ref={
                          props.selectedMsg === message._id
                            ? selectedMsgRef
                            : null
                        }
                        className={`w-full ${
                          props.selectedMsg === message._id
                            ? "bg-red-200 rounded"
                            : ""
                        } flex flex-row mt-1 `}
                      >
                        <span className="max-w-screen-md bg-orange-300 rounded">
                          <div className=" flex flex-row rounded pr-6 pl-2">
                            {message.message}
                          </div>
                          <div className="flex flex-row justify-end pr-1  text-red-800 text-[10px]">
                            {getTime(message.time)}
                          </div>
                        </span>
                      </div>
                    </>
                  );
                }
              })}
            </>
          ) : (
            <></>
          )}
          {messages.length ? (
            <>
              <div className="flex flex-row justify-center">
                <span className="w-1/3 bg-green-400 text-center py-1 rounded">
                  {currDate}
                </span>
              </div>
            </>
          ) : (
            <></>
          )}
          {scrollDownButton ? (
            <>
              <div className=" w-2/3 h-[50px] fixed flex flex-row justify-center">
                <span
                  onClick={() => {
                    scrollBlock.current.scrollTop = 0;
                  }}
                  className="bg-gray-300 h-full w-[50px] flex flex-row justify-center rounded-full items-center"
                >
                  <svg
                    className="fill-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    height="1em"
                    viewBox="0 0 448 512"
                  >
                    <path d="M201.4 342.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 274.7 86.6 137.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
                  </svg>
                </span>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
        <div className="h-1/6 flex flex-row justify-center items-center space-x-3">
          <textarea
            className="w-3/4 h-4/6 px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline resize-none "
            ref={chatInputRef}
            onChange={setTyping}
          />
          <button
            className="px-4 py-1 border rounded-lg font-normal bg-green-600 text-white"
            onClick={sendButtonHandler}
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatBox;
