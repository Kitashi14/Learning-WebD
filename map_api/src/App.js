/** @format */

import MapForm from "./components/form";
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
      <MapForm />
    </>
  );
}

export default App;
