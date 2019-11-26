import React from "react";
import classNames from "classnames";
import { UserSettings, Logout, Tooltip } from "grommet-icons";
import { Link } from "react-router-dom";
// reactstrap components
import {
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Input,
  NavbarBrand,
  Navbar,
  NavLink,
  Nav,
  Container,
  Modal
} from "reactstrap";
const user = localStorage.getItem('userName');
var defaultMessage = localStorage.getItem('defaultLanguage') !== 'pt-br' ? require('../../locales/en-us.js') : require('../../locales/pt-br.js');

class AdminNavbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapseOpen: false,
      modalSearch: false,
      color: "navbar-transparent",
      classes: "dropdown show-dropdown",
      data: {},
      userUrl: {},
    };
  }

  handleClick = () => {
    if (this.state.classes === "dropdown show-dropdown") {
      this.setState({ classes: "dropdown show-dropdown show" });
    } else {
      this.setState({ classes: "dropdown show-dropdown" });
    }
  };
  componentDidMount() {
    window.addEventListener("resize", this.updateColor);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateColor);
  }
  // function that adds color white/transparent to the navbar on resize (this is for the collapse)
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
  // this function opens and closes the collapse on small devices
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
  // this function is to open the Search modal
  toggleModalSearch = () => {
    this.setState({
      modalSearch: !this.state.modalSearch
    });
  };
  // this function is to exit dashboard
  logout = () => {
    localStorage.setItem('token', undefined);
    localStorage.setItem('valid', undefined);
    localStorage.setItem('userUrl', undefined);
    localStorage.setItem('defaultLanguage', undefined);
    localStorage.setItem('UserName', undefined);

    this.props.history.push("/auth/login");
  };
  // eslint-disable-next-line no-dupe-class-members
  async componentWillMount() {
    const token = localStorage.getItem('token');

    const response = await fetch(`https://datatongji-backend.herokuapp.com/auth/get_user?token=${token}`)
    const responseJson = await response.json()
    const userImag = responseJson.userImg;
    const user = responseJson.user;

    localStorage.setItem('email', user.email);
    localStorage.setItem('userName', user.name);
    if (userImag != null) {
      localStorage.setItem('userUrl', userImag.url);
    }
  };

  render() {
    let photo = <img alt="..." className="avatar" src={require("assets/img/user.svg")} />
    var url = localStorage.getItem('userUrl');

    if (url !== 'undefined' && url !== '' && url !== null) {
      photo = <img alt="..." className="avatar" src={url} />
    }

    return (
      <>
        <div class="notranslate">
          <Navbar
            className={classNames("navbar-absolute", this.state.color)}
            expand="lg"
          >
            <Container fluid>
              <div className="navbar-wrapper">
                <div
                  className={classNames("navbar-toggle d-inline", {
                    toggled: this.props.sidebarOpened
                  })}
                >
                  <button
                    className="navbar-toggler"
                    type="button"
                    onClick={this.props.toggleSidebar}
                  >
                    <span className="navbar-toggler-bar bar1" />
                    <span className="navbar-toggler-bar bar2" />
                    <span className="navbar-toggler-bar bar3" />
                  </button>
                </div>
                <NavbarBrand 
                onClick={e => e.preventDefault()}
                style={{fontStyle: 'bold', color: 'gray', fontSize: '16px'}}>
                  {this.props.brandText}
                </NavbarBrand>
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
                        {photo}
                      </div>
                      <b className="caret d-none d-lg-block d-xl-block" />
                      <p className="d-lg-none">{user}</p>
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-navbar" right tag="ul">
                      <NavLink tag="li">
                        <Link to="/admin/user-profile">
                          <DropdownItem className="nav-item" ><UserSettings size="small"/><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>{defaultMessage.NavBar.ac1}</DropdownItem>
                        </Link>
                      </NavLink>
                      <NavLink tag="li">
                        <Link to="/auth/talkwithus">
                          <DropdownItem className="nav-item" ><Tooltip size="small"/><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>{defaultMessage.Menu.Talk}</DropdownItem>
                        </Link>
                      </NavLink>
                      <NavLink tag="li">
                        <DropdownItem className="nav-item" onClick={this.logout}><Logout size="small"/><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>{defaultMessage.NavBar.ac2}</DropdownItem>
                      </NavLink>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                  <li className="separator d-lg-none" />
                </Nav>
              </Collapse>
            </Container>
          </Navbar>
          <Modal
            modalClassName="modal-search"
            isOpen={this.state.modalSearch}
            toggle={this.toggleModalSearch}
          >
            <div className="modal-header">
              <Input id="inlineFormInputGroup" placeholder="SEARCH" type="text" />
              <button
                aria-label="Close"
                className="close"
                data-dismiss="modal"
                type="button"
                onClick={this.toggleModalSearch}
              >
                <i className="tim-icons icon-simple-remove" />
              </button>
            </div>
          </Modal>
        </div>
      </>
    );
  }
}

export default AdminNavbar;
