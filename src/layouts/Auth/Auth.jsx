import React from "react";
import { Link, Route, Switch } from "react-router-dom";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import classNames from "classnames";
import {
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  InputGroup,
  NavbarBrand,
  Navbar,
  NavbarToggler,
  NavItem,
  NavLink,
  Nav,
  Container,
} from "reactstrap";
// core components
import Footer from "components/Footer/Footer.jsx";
import routes from '../../routes';

var ps;
var defaultMessage = localStorage.getItem('authLanguage') !== 'pt-br' ? require('../../locales/en-us.js') : require('../../locales/pt-br.js');

class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: "primary",
      collapseOpen: false,
      color: "navbar-transparent",
      classes: "dropdown show-dropdown",
      sidebarOpened:
        document.documentElement.className.indexOf("nav-open") !== -1
    };
  }
  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      document.documentElement.className += " perfect-scrollbar-on";
      document.documentElement.classList.remove("perfect-scrollbar-off");
      ps = new PerfectScrollbar(this.refs.mainPanel, { suppressScrollX: true });
      let tables = document.querySelectorAll(".table-responsive");
      for (let i = 0; i < tables.length; i++) {
        ps = new PerfectScrollbar(tables[i]);
      }
    }
    window.addEventListener("resize", this.updateColor);
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
      document.documentElement.className += " perfect-scrollbar-off";
      document.documentElement.classList.remove("perfect-scrollbar-on");
    }
    window.removeEventListener("resize", this.updateColor);
  }
  componentDidUpdate(e) {
    if (e.history.action === "PUSH") {
      if (navigator.platform.indexOf("Win") > -1) {
        let tables = document.querySelectorAll(".table-responsive");
        for (let i = 0; i < tables.length; i++) {
          ps = new PerfectScrollbar(tables[i]);
        }
      }
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      this.refs.mainPanel.scrollTop = 0;
    }
  }
  toggleSidebar = () => {
    document.documentElement.classList.toggle("nav-open");
    this.setState({ sidebarOpened: !this.state.sidebarOpened });
  };
  getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.layout === "/auth") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };

  getBrandText = path => {
    for (let i = 0; i < routes.length; i++) {
      if (
        this.props.location.pathname.indexOf(
          routes[i].layout + routes[i].path
        ) !== -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };


  handleClick = () => {
    if (this.state.classes === "dropdown show-dropdown") {
      this.setState({ classes: "dropdown show-dropdown show" });
    } else {
      this.setState({ classes: "dropdown show-dropdown" });
    }
  };

  updateColor = () => {
    if (window.innerWidth < 993 && this.state.collapseOpen) {
      this.setState({
        color: "bg-white"
      });
    } else {
      this.setState({
        color: "navbar-transparent"
      });
    }
  };

  toggleCollapse = () => {
    if (this.state.collapseOpen) {
      this.setState({
        color: "navbar-transparent"
      });
    } else {
      this.setState({
        color: "bg-white"
      });
    }
    this.setState({
      collapseOpen: !this.state.collapseOpen
    });
  };


  render() {
    return (
      <>
        <div
          className="main-panel"
          ref="mainPanel"
          data={this.state.backgroundColor}
        >
          {/* <Navbar expand="lg" color='primary'>
            <Container>
              <NavbarToggler onClick={this.toggle}>
                <span className="navbar-toggler-bar navbar-kebab"></span>
                <span className="navbar-toggler-bar navbar-kebab"></span>
                <span className="navbar-toggler-bar navbar-kebab"></span>
              </NavbarToggler>
              <Collapse isOpen={this.state.isOpen} navbar>
                <NavbarBrand>Hidden Brand</NavbarBrand>
                <Nav navbar>
                  <NavItem active>
                    <NavLink to="#pablo">
                      Link
                                </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink to="#pablo">
                      Link
                                </NavLink>
                  </NavItem>
                </Nav>
              </Collapse>
            </Container>
          </Navbar>

          <Navbar
            className={classNames("navbar-absolute", this.state.color)}
            expand="xl"
          >
            <Container fluid>
              <div className="navbar-wrapper">
              </div>
              <Collapse navbar isOpen={this.state.collapseOpen}>
              <Nav className="ml-auto" navbar>
                <UncontrolledDropdown nav>
                  <DropdownToggle
                    caret
                    color="default"
                    data-toggle="dropdown"
                    nav
                    onClick={e => e.preventDefault()}
                  >
                    <i class="fas fa-ellipsis-v" />
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-navbar" right tag="ul">
                    <NavLink tag="li">
                      <Link to="/auth/login">
                        <DropdownItem className="nav-item" >{defaultMessage.NavBar.auth.ac1}</DropdownItem>
                      </Link>
                    </NavLink>
                    <NavLink tag="li">
                      <Link to="/auth/talkwithus">
                        <DropdownItem className="nav-item" >{defaultMessage.NavBar.auth.ac3}</DropdownItem>
                      </Link>
                    </NavLink>
                    <NavLink tag="li">
                      <Link to="/auth/about">
                        <DropdownItem className="nav-item" >{defaultMessage.NavBar.auth.ac2}</DropdownItem>
                      </Link>
                    </NavLink>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <li className="separator d-lg-none" />
              </Nav>
              </Collapse>
            </Container>
          </Navbar><br /> */}
          <Switch>{this.getRoutes(routes)}</Switch>
          {// we don't want the Footer to be rendered on map page
            this.props.location.pathname.indexOf("maps") !== -1 ? null : (
              <Footer fluid />
            )}
        </div>
      </>
    );
  }
}

export default Auth;
