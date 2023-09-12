/** @format */

import Navbar from "./Components/navbar";
import ChatPage from "./chatPage";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useSocket } from "./socket";

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
      <div className="h-screen">
        <Navbar />
        <ChatPage />
      </div>
    </>
  );
}

export default App;
