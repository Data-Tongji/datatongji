import React from "react";
import { MDBCardImage } from 'mdbreact';
import {
  Button,
  ButtonGroup,
  Row,
  Col,
  CardText,
  Container,
  Card,
  CardBody,
  CardTitle,
  Nav,
  NavItem,
  Table
} from "reactstrap";
import { SocialIcon } from 'react-social-icons';

export class About extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      defaultMessage: require('../locales/en-us.js')
    };
  };


  componentWillMount() {
    if (localStorage.getItem('authLanguage') !== 'pt-br') {
      localStorage.setItem('authLanguage', 'en-us');
      this.setState({
        language: 'en-us',
        defaultMessage: require('../locales/en-us.js')
      });
    } else {
      this.setState({
        language: 'pt-br',
        defaultMessage: require('../locales/pt-br.js')
      })
    }
  };

  changeLanguage(lg) {
    if (this.state.language !== lg) {
      localStorage.setItem('authLanguage', lg);
      this.setState({
        language: lg,
        defaultMessage: require(`../locales/${lg}.js`)
      })
    }
  };

  buttoncolor(language) {
    if (language === this.state.language) {
      return "primary"
    }
    else {
      return "secondary"
    }
  };

  render() {
    return (
      <>
        <Container style={{ justifyContent: 'center', width: '95%' }}>
          <div class="notranslate">
            <Row style={{ marginRight: '3%', marginLeft: '3%', marginTop: '2%' }} >
              <Col md="12">
                <Card className="card-user">
                  <CardBody >
                    <CardText />
                    <div className="author" onmousedown='return false' onselectstart='return false'>
                      <div className="block block-one" />
                      <div className="block block-two" />
                      <div className="block block-three" />
                      <div className="block block-four" />
                      <a href="/#/" class="unselectable">
                        <img
                          alt="..."
                          className="avatar-logo"
                          style={{ maxWidth: '30%' }}
                          src={require("assets/img/logoTong.png")}
                        />
                      </a><br />
                      <ButtonGroup>
                        <Button
                          className="btn-round btn-icon animation-on-hover"
                          style={{ top: '15px' }}
                          color={this.buttoncolor('en-us')}
                          onClick={() => this.changeLanguage('en-us')}
                          active={this.state.language === 'en-us'}
                          size="sm">
                          <span class="flag-icon flag-icon-us flag-icon-squared" style={{ left: '7px' }} />
                        </Button>
                        <Button
                          className="btn-round btn-icon animation-on-hover"
                          style={{ top: '15px' }}
                          color={this.buttoncolor('pt-br')}
                          onClick={() => this.changeLanguage('pt-br')}
                          active={this.state.language === 'pt-br'}
                          size="sm">
                          <span class="flag-icon flag-icon-br flag-icon-squared" style={{ left: '7px' }} />
                        </Button>
                      </ButtonGroup>
                    </div>
                    <div className="card-description" style={{ marginLeft: '2%', marginRight: '2%', textAlign: 'justify' }}>
                      <span class="unselectable" style={{ textAlign: 'justify' }}>
                        {this.state.defaultMessage.About.p1}
                      </span>
                      <p /><span class="unselectable" style={{ textAlign: 'justify' }}>
                        {this.state.defaultMessage.About.p2}
                      </span>
                    </div>
                  </CardBody ><br />
                  <div class="react-card"></div>
                  <Container style={{ justifyContent: 'center', width: '90%' }}>
                    <Table responsive>
                      <thead>
                        <tr>
                          <th><MDBCardImage cascade className="img-fluid" src={require("assets/img/Lucas.jpg")} />
                            <br /><CardTitle class="unselectable" style={{ textAlign: 'center' }}><span class="unselectable">Lucas Damas</span></CardTitle>
                            <Nav style={{ justifyContent: 'center', alignItems: 'center' }}>
                              <NavItem>
                                <SocialIcon sm url="https://linkedin.com/in/lucas-damas-corr%C3%AAa-882806176/" target="_blank" style={{ height: 30, width: 30 }} />
                              </NavItem>
                              <NavItem ><span>&nbsp;&nbsp;</span></NavItem >
                              <NavItem>
                                <SocialIcon sm url="https://github.com/lucasdcorrea1" target="_blank" style={{ height: 30, width: 30 }} fgColor="#000" />
                              </NavItem>
                            </Nav>
                          </th>
                          <th><MDBCardImage cascade className="img-fluid" src={require("assets/img/Leonardo.jpg")} />
                            <br /><CardTitle class="unselectable" style={{ textAlign: 'center' }}><span class="unselectable">Leonardo Ronne</span></CardTitle>
                            <Nav style={{ justifyContent: 'center', alignItems: 'center' }}>
                              <NavItem>
                                <SocialIcon sm url="https://linkedin.com/in/leoronne" target="_blank" style={{ height: 30, width: 30 }} />
                              </NavItem>
                              <NavItem ><span>&nbsp;&nbsp;</span></NavItem >
                              <NavItem>
                                <SocialIcon sm url="https://github.com/leoronne" target="_blank" style={{ height: 30, width: 30 }} fgColor="#000" />
                              </NavItem>
                            </Nav>
                          </th>
                        </tr>
                      </thead>
                    </Table>
                  </Container>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </>
    );
  }
}

export default About;
