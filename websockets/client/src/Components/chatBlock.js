import ChatBox from "./chatBox";

const ChatBlock = (props)=>{

    return (
        <>
            {props.isChatBoxOpen? (
                <>
                <ChatBox 
                isOld={props.isOld} 
                userInfo ={props.userInfo}
                selectedMsg ={props.selectedMsg}
                />
                </>
            ):(
                <>
                <div className="bg-white flex w-2/3 flex-col h-full justify-center items-center text-gray-400 text-xl">
                Your chat will appear here
              </div>
                </>
            )}
        </>
    );
}

export default ChatBlock;