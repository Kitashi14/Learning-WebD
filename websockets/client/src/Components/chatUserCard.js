const ChatUserCard = (props)=>{

    const user = props.user;
    const date = new Date(user.latestMessage);
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
                </span>
                <span className="text-green-800 text-xl italic pl-2 font-serif">
                  {user.messages.length
                    ? user.messages[user.messages.length - 1].message
                    : "lores ipsum"}
                </span>
              </div>
              <div className="w-1/5 h-full  flex flex-col  pr-4 py-2 space-y-2 items-end">
                <span className="text-blue-800 font-mono">
                  {user.latestMessage
                    ? `${
                        date.getDate() < 10
                          ? `0${date.getDate()}`
                          : date.getDate()
                      }/${
                        date.getMonth() < 10
                          ? `0${date.getMonth()}`
                          : date.getMonth()
                      }/${date.getFullYear()}`
                    : ""}
                </span>
                <span className="text-blue-800 font-mono">
                  {user.latestMessage
                    ? `${
                        date.getHours() < 10
                          ? `0${date.getHours()}`
                          : date.getHours()
                      }:${
                        date.getMinutes() < 10
                          ? `0${date.getMinutes()}`
                          : date.getMinutes()
                      }`
                    : ""}
                </span>
              </div>
            </button>
    );
}

export default ChatUserCard;