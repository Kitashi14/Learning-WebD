import { Sidenav, Nav } from "rsuite";
import DashboardIcon from "@rsuite/icons/legacy/Dashboard";
import GroupIcon from "@rsuite/icons/legacy/Group";
import PeopleBranchIcon from '@rsuite/icons/PeopleBranch';
import PinIcon from "@rsuite/icons/Pin";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import DataContext from "../context/dataContext";

// side navbar of the website
const Navbar = (props) => {
  // react-hook/function for navigating to different routes
  const navigate = useNavigate();
  const contextData = useContext(DataContext);

  return (
    <div className="w-1/5">
      <Sidenav appearance="inverse">
        <Sidenav.Body className="h-screen">
          <Nav activeKey="1">
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
            <Nav.Item
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
            </Nav.Item>
            <Nav.Item
              eventKey="4"
              icon={<PeopleBranchIcon />}
              style={
                props.currentTab === "dev"
                  ? { background: "#2589F4" }
                  : { background: "#3498FE" }
              }
              onClick={() => {
                contextData.setIsDevPageLoading(true);
                navigate(`/dev/view/${contextData.devMetrics_currentUser}`);
              }}
            >
              Dev Metrics
            </Nav.Item>
          </Nav>
        </Sidenav.Body>
      </Sidenav>
    </div>
  );
};

export default Navbar;
