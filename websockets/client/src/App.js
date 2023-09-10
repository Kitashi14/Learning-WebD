import Navbar from "./Components/navbar";
import ChatPage from "./chatPage";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

function App() {
  return (
    <>
    <ToastContainer
						autoClose={1000}
						position={toast.POSITION.BOTTOM_RIGHT}
						hideProgressBar
						theme="light"
					/>
    <Navbar/>
    <ChatPage/>
    </>
  );
}

export default App;
