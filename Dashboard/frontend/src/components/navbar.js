// import { Sidenav, Nav } from "rsuite";
// import DashboardIcon from "@rsuite/icons/legacy/Dashboard";
// import GroupIcon from "@rsuite/icons/legacy/Group";
// import PeopleBranchIcon from "@rsuite/icons/PeopleBranch";
// import TableColumnIcon from "@rsuite/icons/TableColumn";
// import PinIcon from "@rsuite/icons/Pin";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useContext } from "react";
// import DataContext from "../context/dataContext";

// // side navbar of the website
// const Navbar = (props) => {
//   // react-hook/function for navigating to different routes
//   const navigate = useNavigate();
//   const contextData = useContext(DataContext);
//   const location = useLocation();

//   return (
//     <div className="w-1/5">
//       <Sidenav appearance="inverse">
//         <Sidenav.Body className="h-screen">
//           <Nav activeKey="6">
//             <Nav.Item
//               eventKey="1"
//               icon={<GroupIcon />}
//               style={{ background: "#1675E0" }}
//               onClick={() => {
//                 navigate("/");
//               }}
//             >
//               Dashboard
//             </Nav.Item>
//             {/* <Nav.Item
//               eventKey="2"
//               icon={<DashboardIcon />}
//               style={
//                 props.currentTab === "dpl"
//                   ? { background: "#2589F4" }
//                   : { background: "#3498FE" }
//               }
//               onClick={() => {
//                 navigate(`/dpl/view/${contextData.dpl_currentUser}`);
//               }}
//             >
//               DPL Metrics
//             </Nav.Item>
//             <Nav.Item
//               eventKey="3"
//               icon={<PinIcon />}
//               style={
//                 props.currentTab === "active"
//                   ? { background: "#2589F4" }
//                   : { background: "#3498FE" }
//               }
//               onClick={() => {
//                 navigate(`/active/view/${contextData.active_currentUser}`);
//               }}
//             >
//               Active Releases
//             </Nav.Item> */}
//             <Nav.Item
//               eventKey="4"
//               icon={<PeopleBranchIcon />}
//               style={
//                 props.currentTab === "dev"
//                   ? { background: "#2589F4" }
//                   : { background: "#3498FE" }
//               }
//               onClick={() => {
//                 if (
//                   !location.pathname.includes(
//                     `/dev/view/${contextData.devMetrics_currentUser}`
//                   )
//                 ) {
//                   contextData.setIsDevPageLoading(true);
//                   navigate(`/dev/view/${contextData.devMetrics_currentUser}`);
//                 }
//               }}
//             >
//               Dev Metrics
//             </Nav.Item>

//             <hr className="my-1 border-blue-300" />
//             <Nav.Item
//               eventKey={6}
//               icon={<DashboardIcon />}
//               // style={
//               //   props.currentTab === "autons"
//               //     ? { background: "#2589F4" }
//               //     : { background: "#3498FE" }
//               // }
//               title="Test Metrics"
//               panel
//               className="pl-4 pt-1"
//             >
//               Test Metrics
//             </Nav.Item>
//             <Nav.Item
//               eventKey="6-1"
//               icon={<TableColumnIcon />}
//               style={
//                 props.currentTab === "autons"
//                   ? { background: "#2589F4" }
//                   : { background: "#3498FE" }
//               }
//               onClick={() => {
//                 if (
//                   !location.pathname.includes(
//                     `/autons/view/${contextData.autons_currentUser}`
//                   )
//                 ) {
//                   contextData.setIsAutonsPageLoading(true);
//                   navigate(`/autons/view/${contextData.autons_currentUser}`);
//                 }
//               }}
//             >
//               Autons
//             </Nav.Item>
//             <Nav.Item
//               eventKey="6-2"
//               icon={<TableColumnIcon />}
//               style={
//                 props.currentTab === "teacats"
//                   ? { background: "#2589F4" }
//                   : { background: "#3498FE" }
//               }
//               onClick={() => {
//                 if (
//                   !location.pathname.includes(
//                     `/teacats/view/${contextData.teacats_currentUser}`
//                   )
//                 ) {
//                   contextData.setIsAutonsPageLoading(true);
//                   navigate(`/teacats/view/${contextData.teacats_currentUser}`);
//                 }
//               }}
//             >
//               Teacats
//             </Nav.Item>
//             <hr className="mt-1 mb-0 border-blue-300" />
//             <Nav.Item
//               eventKey="5"
//               icon={<PinIcon />}
//               style={
//                 props.currentTab === "loc"
//                   ? { background: "#2589F4" }
//                   : { background: "#3498FE" }
//               }
//               onClick={() => {
//                 if (
//                   !location.pathname.includes(
//                     `/loc/view/${contextData.loc_currentUser}`
//                   )
//                 ) {
//                   contextData.setIsLocPageLoading(true);
//                   navigate(`/loc/view/${contextData.loc_currentUser}`);
//                 }
//               }}
//             >
//               LOC Metrics
//             </Nav.Item>
//             <hr className="mt-1 mb-0 border-blue-300" />
//           </Nav>
//         </Sidenav.Body>
//       </Sidenav>
//     </div>
//   );
// };

// export default Navbar;

import { Sidenav, Nav } from "rsuite";
import DashboardIcon from "@rsuite/icons/legacy/Dashboard";
import GroupIcon from "@rsuite/icons/legacy/Group";
import PeopleBranchIcon from "@rsuite/icons/PeopleBranch";
import TableColumnIcon from "@rsuite/icons/TableColumn";
import PinIcon from "@rsuite/icons/Pin";
import GearCircleIcon from "@rsuite/icons/legacy/GearCircle";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import DataContext from "../context/dataContext";

// side navbar of the website
const Navbar = (props) => {
  // react-hook/function for navigating to different routes
  const navigate = useNavigate();
  const contextData = useContext(DataContext);
  const location = useLocation();

  return (
    <div className="w-1/5">
      <Sidenav appearance="inverse">
        <Sidenav.Body className="h-screen">
          <Nav activeKey={6}>
            <Nav.Item
              eventKey="1"
              icon={<GroupIcon />}
              style={{ background: "#1675E0" }}
              onClick={() => {
                navigate("/");
              }}
            >
              Dashboard
            </Nav.Item>
            {/* <Nav.Item
              eventKey="2"
              icon={<DashboardIcon />}
              style={
                props.currentTab === "dpl"
                  ? { background: "#2589F4" }
                  : { background: "#3498FE" }
              }
              onClick={() => {
                navigate(`/dpl/view/${contextData.dpl_currentUser}`);
              }}
            >
              DPL Metrics
            </Nav.Item>
            <Nav.Item
              eventKey="3"
              icon={<PinIcon />}
              style={
                props.currentTab === "active"
                  ? { background: "#2589F4" }
                  : { background: "#3498FE" }
              }
              onClick={() => {
                navigate(`/active/view/${contextData.active_currentUser}`);
              }}
            >
              Active Releases
            </Nav.Item> */}
            <Nav.Item
              eventKey="4"
              icon={<PeopleBranchIcon />}
              style={
                props.currentTab === "dev"
                  ? { background: "#2589F4" }
                  : { background: "#3498FE" }
              }
              onClick={() => {
                if (
                  !location.pathname.includes(
                    `/dev/view/${contextData.devMetrics_currentUser}`
                  )
                ) {
                  contextData.setIsDevPageLoading(true);
                  navigate(`/dev/view/${contextData.devMetrics_currentUser}`);
                }
              }}
            >
              Dev Metrics
            </Nav.Item>

            <Nav.Menu
              eventKey="6"
              title="Test Metrics"
              style={{
                background: "#FFFFFF",
              }}
              icon={<GearCircleIcon />}
            >
              <Nav.Item
                eventKey="6-1"
                icon={<TableColumnIcon />}
                style={
                  props.currentTab === "autons"
                    ? { background: "#2589F4", fontSize: 16 }
                    : { background: "#3498FE", fontSize: 16 }
                }
                onClick={() => {
                  if (
                    !location.pathname.includes(
                      `/autons/view/${contextData.autons_currentUser}`
                    )
                  ) {
                    contextData.setIsAutonsPageLoading(true);
                    navigate(`/autons/view/${contextData.autons_currentUser}`);
                  }
                }}
              >
                Autons
              </Nav.Item>
              <Nav.Item
                eventKey="6-2"
                icon={<TableColumnIcon />}
                style={
                  props.currentTab === "teacats"
                  ? { background: "#2589F4", fontSize: 16 }
                  : { background: "#3498FE", fontSize: 16 }
                }
                onClick={() => {
                  if (
                    !location.pathname.includes(
                      `/teacats/view/${contextData.teacats_currentUser}`
                    )
                  ) {
                    contextData.setIsAutonsPageLoading(true);
                    navigate(
                      `/teacats/view/${contextData.teacats_currentUser}`
                    );
                  }
                }}
              >
                Teacats
              </Nav.Item>
            </Nav.Menu>
            <Nav.Item
              eventKey="5"
              icon={<PinIcon />}
              style={
                props.currentTab === "loc"
                  ? { background: "#2589F4" }
                  : { background: "#3498FE" }
              }
              onClick={() => {
                if (
                  !location.pathname.includes(
                    `/loc/view/${contextData.loc_currentUser}`
                  )
                ) {
                  contextData.setIsLocPageLoading(true);
                  navigate(`/loc/view/${contextData.loc_currentUser}`);
                }
              }}
            >
              LOC Metrics
            </Nav.Item>
            {/* <hr className="mt-1 mb-0 border-blue-300" /> */}
          </Nav>
        </Sidenav.Body>
      </Sidenav>
    </div>
  );
};

export default Navbar;
