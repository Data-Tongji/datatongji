
import React from "react";
import { Link } from "react-router-dom";
import NotificationAlert from "react-notification-alert";
import {
  Row,
  ButtonGroup,
  Col,
  CardText,
  Button,
  Card,
  CardBody,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from "reactstrap";
import { DotLoader } from 'react-spinners';

export class Login extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      name: '',
      email: '',
      password: '',
      register: false,
      focusedl: '',
      language: '',
      focusedp: '',
      loading: false,
      defaultMessage: require('../locales/en-us.js')
    };
    this.signIn = this.signIn.bind(this);
    this.register = this.register.bind(this);
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

  async signIn() {
    this.setState({ loading: true });
    const requestInfo = {
      method: 'POST',
      body: JSON.stringify({ "email": this.state.email, "password": this.state.password, "language": this.state.language }),
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
    }
    try {
      const response = await fetch('https://datatongji-backend.herokuapp.com/auth/authenticate', requestInfo);
      var token = await response.json();
      if (response.ok) {
        localStorage.setItem('token', token);
        localStorage.setItem('valid', "OK");
        await this.getUserConfig(token);
        this.setState({
          loading: false
        });
        this.props.history.push("/admin/dashboard");
        return;
      } else {
        throw new Error(token.error);
      }
    } catch (e) {
      this.notify('br', e.message, 'fas fa-exclamation-triangle', 'danger');
      this.setState({
        loading: false
      });
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


  async getUserConfig() {
    const token = localStorage.getItem('token');
    const response = await fetch(`https://datatongji-backend.herokuapp.com/auth/get_user_config?token=${token}`);
    const responseJson = await response.json();

    localStorage.setItem('background', responseJson.backgroundColor);
    localStorage.setItem('sidebarColor', responseJson.sidebarColor);
    localStorage.setItem('defaultLanguage', responseJson.defaultLanguage);
  };

  async register() {
    this.setState({ loading: true });
    const requestInfo = {
      method: 'POST',
      body: JSON.stringify({ "name": this.state.name, "email": this.state.email, "password": this.state.password, "language": this.state.language }),
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
    };
    try {
      const response = await fetch('https://datatongji-backend.herokuapp.com/auth/register', requestInfo);
      var promise = await response.json();
      if (response.ok) {
        this.notify('br', this.state.defaultMessage.Forms.reg.msg, 'fas fa-check', 'success');
        this.setState({
          register: false,
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
  };

  userRegister = () => {
    if (this.state.register === true)
      return this.setState({ register: false });

    return this.setState({ register: true });
  };

  inputValidation = () => {
    if (this.state.register === true) {
      if (this.state.name == null || this.state.name.trim() === '') {
        return this.notify('br', this.state.defaultMessage.Forms.name.error, 'fas fa-exclamation-triangle', 'danger');
      }
    }
    if (this.state.email == null || this.state.email.trim() === '') {
      return this.notify('br', this.state.defaultMessage.Forms.email.error, 'fas fa-exclamation-triangle', 'danger');
    }
    else if (this.state.password == null || this.state.password.trim() === '') {
      return this.notify('br', this.state.defaultMessage.Forms.pass.error, 'fas fa-exclamation-triangle', 'danger');
    }
    else {
      if (this.state.register) {
        this.register();
      } else {
        this.signIn();
      }
    }
  };

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

  render() {
    let register;
    let actionLoginText = this.state.defaultMessage.NavBar.auth.ac1;
    let nameLabel;
    document.body.classList.remove("white-content")
    if (this.state.register === true) {
      actionLoginText = this.state.defaultMessage.NavBar.auth.ac4
      nameLabel = <Label for="exampleEmail">{this.state.defaultMessage.Forms.name.title}:</Label>
      register = <InputGroup className={this.state.focusedn}>
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
    }
    if (this.state.loading === true) {
      actionLoginText = <DotLoader
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
      <>
        <Row>
          <div className="react-notification-alert-container">
            <NotificationAlert ref="notificationAlert" />
          </div>
          {/* <div class="notranslate"> */}
          <Col className="col_center_login" md="4">
            <Card className="card-user">
              <CardBody>
                <CardText />
                <div className="author">
                  <div className="block block-one" />
                  <div className="block block-two" />
                  <div className="block block-three" />
                  <div className="block block-four" />
                  <img
                    alt="..."
                    className="avatar-logo"
                    src={require("assets/img/logoTong.png")}
                  /><br />
                  <ButtonGroup>
                    <Button
                      className="btn-round btn-icon animation-on-hover"
                      style={{ top: '15px' }}
                      color={this.buttoncolor('en-us')}
                      onClick={() => this.changeLanguage('en-us')}
                      active={this.state.language === 'en-us'}
                      size="sm">
                      <span className="flag-icon flag-icon-us flag-icon-squared" style={{ left: '7px' }} />
                    </Button>
                    <Button
                      className="btn-round btn-icon animation-on-hover"
                      style={{ top: '15px' }}
                      color={this.buttoncolor('pt-br')}
                      onClick={() => this.changeLanguage('pt-br')}
                      active={this.state.language === 'pt-br'}
                      size="sm">
                      <span className="flag-icon flag-icon-br flag-icon-squared" style={{ left: '7px' }} />
                    </Button>
                  </ButtonGroup>
                </div><br />
                <FormGroup>
                  {nameLabel}
                  {register}
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
                  <Label for="examplePassword">{this.state.defaultMessage.Forms.pass.title}:</Label>
                  <InputGroup className={this.state.focusedp}>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText><i className="fas fa-key" style={{ marginRight: '10px' }}></i></InputGroupText>
                    </InputGroupAddon>
                    <Input
                      type="password"
                      name="password"
                      id="examplePassword"
                      placeholder={this.state.defaultMessage.Forms.pass.title}
                      onFocus={() => {
                        this.setState({
                          focusedp: "input-group-focus",
                        });
                      }}
                      autoComplete="off"
                      onBlur={this.onBlur}
                      onChange={this.handleChange}
                    />
                  </InputGroup>
                </FormGroup>
                <Button
                  disabled={this.state.loading}
                  color="primary"
                  block
                  className="btn-round"
                  type="button" onClick={this.inputValidation}
                >
                  {actionLoginText}
                </Button>
              </CardBody>
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
            </Card>
          </Col>
          {/* </div> */}
        </Row>
      </>
    );
  }
}

export default Login;
