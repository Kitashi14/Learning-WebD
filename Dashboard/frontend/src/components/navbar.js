import { Sidenav, Nav } from "rsuite";
import DashboardIcon from "@rsuite/icons/legacy/Dashboard";
import GroupIcon from "@rsuite/icons/legacy/Group";
import PinIcon from "@rsuite/icons/Pin";
import { useNavigate } from "react-router-dom";

// side navbar of the website
const Navbar = (props) => {
  // react-hook/function for navigating to different routes
  const navigate = useNavigate();

  return (
    <div className="w-1/5">
      <Sidenav appearance="inverse" defaultOpenKeys={["3", "4"]}>
        <Sidenav.Body className="h-screen">
          <Nav activeKey="1">
            <Nav.Item
              eventKey="1"
              icon={<GroupIcon />}
              style={{background:'#1675E0'}}
              onClick={() => {
                navigate("/");
              }}
            >
              Dashboard
            </Nav.Item>
            <Nav.Item
              eventKey="2"
              icon={<DashboardIcon />}
              style={props.currentTab==="dpl"?{background:'#2589F4'}:{}}
              onClick={() => {
                navigate("dpl/view/all");
              }}
            >
              DPL metric
            </Nav.Item>
            <Nav.Item
              eventKey="3"
              icon={<PinIcon />}
              style={props.currentTab==="active"?{background:'#2589F4'}:{}}
              onClick={() => {
                navigate("active/view/all");
              }}
            >
              Active Releases
            </Nav.Item>
          </Nav>
        </Sidenav.Body>
      </Sidenav>
    </div>
  );
};

export default Navbar;
