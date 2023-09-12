/** @format */

import { useContext, useRef } from "react";
import ChatContext from "../context/chatContext";
import AuthContext from "../context/authContext";

const ChatBox = (props) => {
  const chatInputRef = useRef();
  const chat = useContext(ChatContext);
  const auth = useContext(AuthContext);

  const userName = props.isOld ? props.userInfo.userName : props.userInfo;

  const backButtonHandler = () => {
    props.closeChatBox();
  };

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
  var messages;
  if(props.isOld && props.userInfo.messages.length){
    messages = JSON.parse(JSON.stringify(props.userInfo.messages));
    messages.reverse();
  }

  return (
    <>
      <div className="bg-orange-200 flex flex-col h-full">
        <div className="h-1/6 flex flex-row pl-2 items-center text-blue-600 text-xl font-bold bg-green-300 ">
          <button
            className="border bg-green-600 text-white py-1 px-3 font-medium rounded shadow"
            onClick={backButtonHandler}
          >
            Back
          </button>
          <span className="ml-5">{`${userName}`}</span>
        </div>
        <div className="bg-white h-4/6 flex flex-col-reverse space-y-1 py-1 px-2 overflow-scroll overflow-x-hidden ">
          {props.isOld && props.userInfo.messages.length ? (
            <>
              {messages.map((message) => {
                if (message.to === userName) {
                  return (
                    <div
                      key={message._id}
                      className="w-full  flex flex-row justify-end mt-1"
                    >
                      <span className="max-w-screen-md bg-red-400 rounded px-3 py-1 rounded pl-6">
                        {message.message}
                      </span>
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={message._id}
                      className=" w-full flex flex-row mt-1"
                    >
                      <span className="bg-orange-300 px-3 py-1 rounded pr-6 max-w-screen-md">
                        {message.message}
                      </span>
                    </div>
                  );
                }
              })}
            </>
          ) : (
            <></>
          )}
        </div>
        <div className="h-1/6 flex flex-row justify-center items-center space-x-3">
          <textarea
            className="w-3/4 h-4/6 px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline resize-none "
            ref={chatInputRef}
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
