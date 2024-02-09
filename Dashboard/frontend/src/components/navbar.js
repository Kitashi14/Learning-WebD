import { Sidenav, Nav } from 'rsuite';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import GroupIcon from '@rsuite/icons/legacy/Group';
import { useNavigate } from 'react-router-dom';

// side navbar of the website
const Navbar = () => {

  // react-hook/function for navigating to different routes
  const navigate = useNavigate();

  return (
  <div className='w-1/5'>
    <Sidenav appearance='inverse' defaultOpenKeys={['3', '4']}>
      <Sidenav.Body className='h-screen'>
        <Nav activeKey="1">
          <Nav.Item eventKey="1" icon={<DashboardIcon />} onClick={()=>{
            navigate("/")
          }}>
            Dashboard
          </Nav.Item>
          <Nav.Item eventKey="2" icon={<GroupIcon />} onClick={()=>{
            navigate("dpl/view/all")
          }}>
            DPL metric
          </Nav.Item>
        </Nav>
      </Sidenav.Body>
    </Sidenav>
  </div>
)};

export default Navbar