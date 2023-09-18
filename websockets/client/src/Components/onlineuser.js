/** @format */

const OnlineUsers = (props) => {
  const openUser = (e) => {
    e.preventDefault();
    props.openChatBox(e.target.value);
  };
  return (
    <>
      <div className="h-1/6 w-full flex flex-col bg-blue-400 space-y-2">
        <div className="font-bold text-xl px-3 py-1 underline">Online Users: </div>
        <div className="px-2 text-white text-xl font-bold flex flex-row justify-start items-center space-x-4">
          {props.users.map((data) => {
            return (
              <button
                key={data.userName}
                value={data.userName}
                onClick={openUser}
                className="px-4 py-1 border rounded-lg font-normal bg-green-600 text-white"
              >
                {data.userName}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default OnlineUsers;
