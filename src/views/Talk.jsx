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
  CardBody,
  Row,
  Col,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from "reactstrap";
import { DotLoader } from 'react-spinners';

class Talk extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      language: '',
      textmessage: '',
      name: '',
      email: '',
      defaultMessage: require('../locales/en-us.js')
    }
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onBlur = () => {
    this.setState({
      focusedl: '',
      focusedp: '',
      focusedn: '',
    });
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

  async SendMail() {
    this.setState({ loading: true });
    const requestInfo = {
      method: 'POST',
      body: JSON.stringify({ "name": this.state.name, "email": this.state.email, "message": this.state.textmessage, "language": this.state.language }),
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
    };
    try {
      const response = await fetch('https://datatongji-backend.herokuapp.com/auth/talk_with_us', requestInfo);
      var promise = await response.json();
      if (response.ok) {
        this.notify('br', this.state.defaultMessage.Forms.talk.sendmail, 'fas fa-check', 'success');
        this.setState({
          loading: false
        });
        return;
      } else {
        throw new Error(promise.error);
      }
    }
    catch (e) {
      this.notify('br', e.message, 'fas fa-exclamation-triangle', 'danger');
      this.setState({
        loading: false
      });
    }
  }

  inputValidation = () => {
    if (this.state.name == null || this.state.name.trim() === '') {
      return this.notify('br', this.state.defaultMessage.Forms.name.error, 'fas fa-exclamation-triangle', 'danger');
    }
    if (this.state.email == null || this.state.email.trim() === '') {
      return this.notify('br', this.state.defaultMessage.Forms.email.error, 'fas fa-exclamation-triangle', 'danger');
    }
    else if (this.state.textmessage == null || this.state.textmessage.trim() === '') {
      return this.notify('br', this.state.defaultMessage.Forms.talk.inputmsg.error, 'fas fa-exclamation-triangle', 'danger');
    } else {
      this.SendMail();
    }
  }

  render() {
let btnsend=this.state.defaultMessage.Forms.btnenv.ac1;
    if (this.state.loading === true) {
      btnsend = <DotLoader
        css={`
                      display: block;
                      margin: 0 auto;
                      border-color: red;
                      `}
        sizeUnit={"px"}
        size={20}
        color={'#fff'}
        loading={this.state.loading}
      />
    }

    return (
      <><Container style={{ justifyContent: 'center', width: '95%' }}>
        <Row style={{ marginRight: '3%', marginLeft: '3%', marginTop: '2%' }} >
          <div className="react-notification-alert-container">
            <NotificationAlert ref="notificationAlert" />
          </div>
          <div class="notranslate">
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
                        <FormGroup>
                          <Label for="exampleEmail">{this.state.defaultMessage.Forms.name.title}:</Label>
                          <InputGroup className={this.state.focusedn}>
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText><i className="tim-icons icon-single-02" style={{ marginRight: '10px' }}></i></InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="text"
                              name="name"
                              placeholder={this.state.defaultMessage.Forms.name.title}
                              onFocus={() => {
                                this.setState({
                                  focusedn: "input-group-focus",
                                });
                              }}
                              onBlur={this.onBlur}
                              onChange={this.handleChange}
                            />
                          </InputGroup>
                        </FormGroup>
                        <FormGroup>
                          <Label for="exampleEmail">{this.state.defaultMessage.Forms.email.title}:</Label>
                          <InputGroup className={this.state.focusedl}>
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText><i className="fas fa-at" style={{ marginRight: '10px' }}></i></InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="email"
                              name="email"
                              id="exampleEmail"
                              placeholder={this.state.defaultMessage.Forms.email.title}
                              onFocus={() => {
                                this.setState({
                                  focusedl: "input-group-focus",
                                });
                              }}
                              onBlur={this.onBlur}
                              onChange={this.handleChange}
                            />
                          </InputGroup>
                        </FormGroup>
                        <FormGroup>
                          <Label for="exampleText">{this.state.defaultMessage.Forms.talk.inputmsg.title}:</Label>
                          <Input
                            type="textarea"
                            placeholder={this.state.defaultMessage.Forms.talk.inputmsg.title}
                            onChange={this.handleChange}
                            name="textmessage"
                            id="exampleText" />
                        </FormGroup><br />
                        <Button
                          disabled={this.state.loading}
                          color="primary"
                          block
                          className="btn-round"
                          type="button" onClick={this.inputValidation}
                        >
                          {btnsend}
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
          </div>
        </Row>
      </Container>
      </>
    );
  }
}

export default Talk;
