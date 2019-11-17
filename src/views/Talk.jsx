import React from "react";
import NotificationAlert from "react-notification-alert";

import {
  Button,
  ButtonGroup,
  Card,
  CardText,
  FormGroup,
  Label,
  Input,
  Container,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
} from "reactstrap";
var defaultMessage = localStorage.getItem('authLanguage') !== 'pt-br' ? require('../locales/en-us.js') : require('../locales/pt-br.js');


class Talk extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      language: ''
    }
  }

  componentWillMount() {
    if (localStorage.getItem('authLanguage') !== 'pt-br') {
      localStorage.setItem('authLanguage', 'en-us');
      this.setState({ language: 'en-us' });
    } else { this.setState({ language: 'pt-br' }) }
  };

  notify = (place, message, icon, color) => {
    var options = {
      place: place,
      message: (
        <div>
          <div>
            {message}
          </div>
        </div>
      ),
      type: color,
      icon: icon,
      autoDismiss: 7
    };
    this.refs.notificationAlert.notificationAlert(options);
  };

  changeLanguage(lg) {
    if (this.state.language !== lg) {
      localStorage.setItem('authLanguage', lg);
      this.setState({ language: lg })
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
      <><Container style={{ justifyContent: 'center', width: '95%' }}>
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
                      style={{ width: '30%' }}
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
                  <Col className="col_center_login" md="7">
                    <Card className="card-user">
                      <CardBody>
                        <CardText />
                        <div className="author">
                        </div>
                        <FormGroup>
                          <Label for="exampleEmail">{defaultMessage.Forms.email.title}:</Label>
                          <Input
                            type="email"
                            name="email"
                            id="exampleEmail"
                            placeholder={defaultMessage.Forms.email.title}
                            onChange={this.handleChange}
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label for="examplePassword">Password</Label>
                          <Input
                            type="password"
                            name="password"
                            id="examplePassword"
                            placeholder="Senha"
                            autoComplete="off"
                            onChange={this.handleChange}
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label for="exampleText">Example textarea</Label>
                          <Input type="textarea" name="text" id="exampleText" />
                        </FormGroup><br />
                        <Button
                          disabled={this.state.loading}
                          color="primary"
                          block
                          className="btn-round"
                          type="button" onClick={this.inputValidation}
                        >
                          Send
                        </Button>
                      </CardBody>
                      {/* <CardFooter>
                        <div className="button-container">
                          <Button className="btn-icon btn-round" color="primary"
                            onClick={this.userRegister}>
                            <i className="fas fa-user-plus"></i>
                          </Button>
                          <Link to="/auth/forgotpassword">
                            <Button className="btn-icon btn-round" color="primary">
                              <i className="fas fa-unlock-alt"></i>
                            </Button>
                          </Link>
                        </div>
                      </CardFooter> */}
                    </Card>
                  </Col>
                </div>
              </CardBody >
              <br />
            </Card>
          </Col>
        </Row>
      </Container>
      </>
    );
  }
}

export default Talk;
