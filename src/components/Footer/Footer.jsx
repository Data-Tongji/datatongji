import React from "react";
import { Button, Container, Nav, NavItem, NavLink } from "reactstrap";
var defaultMessage = localStorage.getItem('defaultLanguage') !== 'pt-br' ? require('../../locales/en-us.js') : require('../../locales/pt-br.js');

class Footer extends React.Component {
  render() {
    return (
      <footer className="footer">
        {/* <Container fluid> */}
          <div className="copyright">
            © {new Date().getFullYear()} -{' '}
            <a
              href="/auth/about"
              rel="noopener noreferrer"
            >
              DATA TONGJÌ
            </a> 
            {/* {' '} | {' '}<a
              href="/auth/talkwithus"
              rel="_blank"
            >
              {defaultMessage.Menu.Talk}
            </a> */}
            .
          </div>
        {/* </Container> */}
      </footer>
    );
  }
}

export default Footer;
