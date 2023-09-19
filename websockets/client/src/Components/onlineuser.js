/** @format */

const OnlineUsers = (props) => {
  const openUser = (e) => {
    e.preventDefault();
    props.openChatBox(e.target.getAttribute("find_user"));
  };
  return (
    <>
      <div className="h-1/6 w-full flex flex-col bg-red-700 justify-center">
        <div className="px-4 text-white text-xl font-bold flex flex-row justify-start items-center space-x-4 overflow-x-scroll sc-hide">
          {props.users.map((data) => {
            return (
              <>
              <div className="flex flex-col items-center justify-center">
                <div className="relative ml-10 mb-[-14px] rounded-full border-2 w-4 h-4 bg-green-400">
                </div>
              <button
                key={data.userName}
                user={data.userName}
                onClick={openUser}
                className="w-16 h-16 border rounded-full font-normal bg-green-600 text-white"
              >
                <img find_user={data.userName} className="rounded-full" src={`https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg`} />
              </button>
              <span className="text-xs pt-0 font-normal">
              {data.userName}
              </span>
              </div>
              </>
             
            );
          })}
        </div>
      </div>
    </>
  );
};

export default OnlineUsers;
