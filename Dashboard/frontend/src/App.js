import Navbar from "./components/navbar";
import "rsuite/dist/rsuite.min.css";
import ProfileViewPage from "./pages/profileViewPage";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/homePage";
import FeatureViewPage from "./pages/featureViewPage";
import { useContext } from "react";
import DataContext from "./context/dataContext";
import { Loader } from "rsuite";
// contains all routes for the client side
function App() {
  const contextData = useContext(DataContext);
  return (
    <>
      <div className="h-screen w-full bg-gray-100 flex flex-row">
        <Navbar />
        <div className="h-full w-4/5 bg-gray-200">
          {contextData.isLoading ? (
            <>
              <div className="h-full w-full flex flex-row justify-center items-center">
              <Loader size="lg" />
              </div>
              
            </>
          ) : (
            <Routes>
              <Route exact path="/" element={<HomePage />}></Route>
              <Route
                exact
                path="/dpl/view/:uid"
                element={<ProfileViewPage type={"dpl"} />}
              ></Route>
              <Route
                exact
                path="/dpl/feature/:fid"
                element={<FeatureViewPage type={"dpl"}/>}
              ></Route>
              <Route
                exact
                path="/active/view/:uid"
                element={<ProfileViewPage type={"active"}/>}
              ></Route>
              <Route
                exact
                path="/active/feature/:fid"
                element={<FeatureViewPage type={"active"}/>}
              ></Route>
            </Routes>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
