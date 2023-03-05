import { Button, Col, Navbar, NavDropdown } from "react-bootstrap";
import { default as Logo } from "../icons/logo.svg";
import { default as User } from '../icons/user.svg';
import { useNavigate } from "react-router-dom";
import '../App.css';

function MyNavbar(props) {

  const navigate = useNavigate();

  return (

    <Navbar fixed="top" expand="lg" bg="success" variant="dark">
      <Col md={2}>
        <Navbar.Brand type="button" onClick={() => navigate("/")}>
          <img src={Logo} alt="study_plan_logo" /> {' '} Study Plan
        </Navbar.Brand>
      </Col>
      <Col md={{ span: 1, offset: 9 }} >
        {(!props.loggedIn) ?
          <Navbar.Brand>
            <img src={User} alt="user_image" bg="blue" className="float-end" />
          </Navbar.Brand> :
          <NavDropdown key={1} id="basic-nav-dropdown" align="end"
            title={
              <Navbar.Brand>
                <img src={User} alt="user_image" bg="blue" className="float-end" />
              </Navbar.Brand>}>
            <NavDropdown.Item key={1.1}>
              <span> User: {props.user?.name} </span>
            </NavDropdown.Item>
            <NavDropdown.Item key={1.2}>
              <Button variant="danger" onClick={props.logout}>Logout</Button>
            </NavDropdown.Item>
          </NavDropdown>}
      </Col>
    </Navbar>

  );
}

export default MyNavbar;