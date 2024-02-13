import Navbar from "./components/navbar";
import "rsuite/dist/rsuite.min.css";
import ProfileViewPage from "./pages/profileViewPage";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/homePage";
import FeatureViewPage from "./pages/featureViewPage";

// contains all routes for the client side
function App() {
  
  return (
    <>
      <div className="h-screen w-full bg-gray-100 flex flex-row">
        <Navbar />
        <div className="h-full w-4/5 bg-gray-200">
          <Routes>
            <Route exact path="/" element={<HomePage />}></Route>
            <Route exact path="/dpl/view/:uid" element={<ProfileViewPage />}></Route>
            <Route exact path="/dpl/feature/:fid" element={<FeatureViewPage/>} ></Route>
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
