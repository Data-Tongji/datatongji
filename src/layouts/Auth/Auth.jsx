import React from "react";
import { Route, Switch } from "react-router-dom";
import classNames from "classnames";
import PerfectScrollbar from "perfect-scrollbar";
import { Group, Home, Tooltip } from "grommet-icons";
import { Link } from "react-router-dom";

import {
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Navbar,
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
    this.localStorageUpdated = this.localStorageUpdated.bind(this)
  };

  localStorageUpdated() {
    console.log('mudou')
  };

  componentDidMount() {
    window.addEventListener('authLanguage', this.localStorageUpdated);
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
    let photo = <img alt="..." className="avatar" src={require("assets/img/logoTong.png")} />;
    return (
      <>
        <div
          className="main-panel"
          ref="mainPanel"
          data={this.state.backgroundColor}
        >
          <Navbar
            className={classNames("navbar-absolute", this.state.color)}
            expand="lg"
          >
            <Container fluid>
              <div className="navbar-wrapper">
              </div>
              <button
                aria-expanded={false}
                aria-label="Toggle navigation"
                className="navbar-toggler"
                data-target="#navigation"
                data-toggle="collapse"
                id="navigation"
                type="button"
                onClick={this.toggleCollapse}
              >
                <span className="navbar-toggler-bar navbar-kebab" />
                <span className="navbar-toggler-bar navbar-kebab" />
                <span className="navbar-toggler-bar navbar-kebab" />
              </button>
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
                      <div className="photo">
                        <img
                          alt="..."
                          className="avatar-logo"
                          src={require("assets/img/logoTong.png")}
                        />
                      </div>
                      <b className="caret d-none d-lg-block d-xl-block" />
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-navbar" right tag="ul">
                      <NavLink tag="li">
                        <Link to="/auth/login">
                          <DropdownItem className="nav-item" ><Home size="small" /><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>{defaultMessage.NavBar.auth.ac1}</DropdownItem>
                        </Link>
                      </NavLink>
                      <NavLink tag="li">
                        <Link to="/auth/about">
                          <DropdownItem className="nav-item" ><Group size="small" /><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>{defaultMessage.NavBar.auth.ac2}</DropdownItem>
                        </Link>
                      </NavLink>
                      <NavLink tag="li">
                        <Link to="/auth/talkwithus">
                          <DropdownItem className="nav-item" ><Tooltip size="small" /><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>{defaultMessage.NavBar.auth.ac3}</DropdownItem>
                        </Link>
                      </NavLink>

                    </DropdownMenu>
                  </UncontrolledDropdown>
                  <li className="separator d-lg-none" />
                </Nav>
              </Collapse>
            </Container>
          </Navbar><br /><br />

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
