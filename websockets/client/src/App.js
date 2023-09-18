/** @format */
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useSocket } from "./socket";
import ChatPage from "./chatPage";


function App() {
  useSocket();
  
  
  return (
    <>
      <ToastContainer
        autoClose={1000}
        position={toast.POSITION.BOTTOM_RIGHT}
        hideProgressBar
        theme="light"
      />
      <ChatPage/>
    </>
  );
}

export default App;
