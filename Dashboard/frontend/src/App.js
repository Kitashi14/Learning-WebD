import Navbar from "./components/navbar";
import "rsuite/dist/rsuite.min.css";
import ProfileViewPage from "./pages/profileViewPage";
import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/homePage";
import FeatureViewPage from "./pages/featureViewPage";
import { useContext, useEffect, useState } from "react";
import DataContext from "./context/dataContext";
import { Loader } from "rsuite";
import ActiveViewPage from "./pages/activeViewPage";
import ActiveFeatureViewPage from "./pages/activeFeatureViewPage";
import DevMetricsViewPage from "./pages/devMetricsPage";
// contains all routes for the client side
function App() {
  const contextData = useContext(DataContext);

  const location = useLocation();
  const [currentTab, setCurrentTab] = useState();

  useEffect(() => {
    // execute on location change
    if (location.pathname.includes("dpl")) {
      setCurrentTab("dpl");
    } else if (location.pathname.includes("active")) setCurrentTab("active");
    else if (location.pathname.includes("dev")) setCurrentTab("dev");
    else {
      setCurrentTab(null);
    }
  }, [location]);

  return (
    <>
      <div className="h-screen w-full bg-gray-100 flex flex-row">
        <Navbar currentTab={currentTab} />
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
                element={<ProfileViewPage />}
              ></Route>
              <Route
                exact
                path="/dpl/feature/:fid"
                element={<FeatureViewPage />}
              ></Route>
              <Route
                exact
                path="/active/view/:uid"
                element={<ActiveViewPage />}
              ></Route>
              <Route
                exact
                path="/active/feature/:fid"
                element={<ActiveFeatureViewPage />}
              ></Route>
              <Route
                exact
                path="/dev/view/:uid"
                element={<DevMetricsViewPage />}
              ></Route>
            </Routes>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
