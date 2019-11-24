
import React from "react";
import Stepper from 'react-stepper-horizontal';
import NotificationAlert from "react-notification-alert";
import { Link } from "react-router-dom";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  FormGroup,
  Label,
  Input,
  Button,
  Card,
  Col,
  Row,
  CardText,
  Nav,
  NavItem,
  CardHeader,
  ButtonGroup,
  CardBody
} from "reactstrap";
import { DotLoader } from 'react-spinners';

const authenticate_token = () => {
  const requestInfo = {
    method: 'POST',
    body: JSON.stringify({ "token": localStorage.getItem('token') }),
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
  };

  fetch('https://datatongji-backend.herokuapp.com/auth/authenticate_token', requestInfo)
    .then(response => {
      if (response.ok) {
        localStorage.setItem('valid', 'OK');
        return true;
      } else {
        localStorage.setItem('valid', 'NO');
        return false;
      }
    });
};

const isAuthenticated = () => {
  if (localStorage.hasOwnProperty('token')) {
    authenticate_token();
    if (localStorage.getItem('valid') === 'OK') {

      return true;
    } else { return false }
  } else {
    return false;
  };
};

export class ForgotPassword extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      steps: [
        { title: '' },
        { title: '' },
        { title: '' },
        { title: '' }],
      stepPosition: 0,
      loading: false,
      focused: "",
      language: '',
      defaultMessage: require('../locales/en-us.js')
    };
  }

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
    if (isAuthenticated()) {
      this.props.history.push("/admin/dashboard");
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

  onFocus = () => {
    this.setState({
      focused: "input-group-focus"
    });
  };

  onBlur = () => {
    this.setState({
      focused: ""
    });
  };

  positionStep = (steps) => {
    var Position = this.state.stepPosition
    if (steps === 1 && Position < this.state.steps.length - 1)
      return this.setState({ stepPosition: Position += + 1 });
    if (steps !== 1 && Position > 0)
      return this.setState({ stepPosition: Position += - 1 });
  };

  async ForgotPass() {
    this.setState({ loading: true });
    const requestInfo = {
      method: 'POST',
      body: JSON.stringify({ "email": this.state.email, "language": this.state.language }),
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
    };
    try {
      const response = await fetch('https://datatongji-backend.herokuapp.com/auth/forgot_password', requestInfo);
      var result = await response.json();
      if (response.ok) {
        this.setState({
          loading: false
        });
        this.notify('br', this.state.defaultMessage.Forms.token.msg, 'fas fa-check', 'success');
        this.positionStep(1);
        return;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      this.notify('br', err.message, 'fas fa-exclamation-triangle', 'danger');
      this.setState({
        loading: false
      });
    }
  }

  async ValidToken() {
    this.setState({ loading: true });
    const requestInfo = {
      method: 'POST',
      body: JSON.stringify({ "email": this.state.email, "token": this.state.token, "language": this.state.language }),
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
    };
    try {
      const response = await fetch('https://datatongji-backend.herokuapp.com/auth/valid_token', requestInfo);
      var result = await response.json();
      if (response.ok) {
        this.setState({
          loading: false
        });
        this.notify('br', this.state.defaultMessage.Forms.token.valid, 'fas fa-check', 'success');
        this.positionStep(1);
        return;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      this.notify('br', err.message, 'fas fa-exclamation-triangle', 'danger');
      this.setState({
        loading: false
      });
    }
  }

  async ResetPass() {
    this.setState({ loading: true });
    const requestInfo = {
      method: 'PUT',
      body: JSON.stringify({ "email": this.state.email, "token": this.state.token, "password": this.state.password, "language": this.state.language }),
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
    };
    try {
      const response = await fetch('https://datatongji-backend.herokuapp.com/auth/reset_password', requestInfo);
      var valid = await response.json();
      if (response.ok) {
        this.positionStep(1);
        this.notify('br', this.state.defaultMessage.Forms.pass.changed, 'fas fa-check', 'success');
        this.setState({
          loading: false
        });
        setTimeout(() => { this.props.history.push("/auth/login") }, 1400);
        return;
      } else {
        throw new Error(valid.error);
      }
    } catch (err) {
      this.notify('br', err.message, 'fas fa-exclamation-triangle', 'danger');
      this.setState({
        loading: false
      });
    }
  }

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

  inputValidation = () => {
    if (this.state.stepPosition === 0) {
      if (this.state.email == null || this.state.email.trim() === "") {
        return this.notify('br', this.state.defaultMessage.Forms.email.error, 'fas fa-exclamation-triangle', 'danger');
      }
      else {
        this.ForgotPass();
      }
    }
    else if (this.state.stepPosition === 1) {
      if (this.state.token == null || this.state.token.trim() === "") {
        return this.notify('br', this.state.defaultMessage.Forms.token.error, 'fas fa-exclamation-triangle', 'danger');
      }
      else {
        this.ValidToken();
      }
    }
    else if (this.state.stepPosition === 2) {
      if (this.state.password == null || this.state.password.trim() === "") {
        return this.notify('br', this.state.defaultMessage.Forms.pass.error, 'fas fa-exclamation-triangle', 'danger');
      }
      else {
        this.ResetPass();
      }
    }
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    let Position = this.state.stepPosition;
    let Card_Body;

    let buttontext = this.state.defaultMessage.Forms.btnenv.ac1;
    if (Position === 2) {
      buttontext = this.state.defaultMessage.Forms.btnenv.ac2
    };
    if (this.state.loading === true) {
      buttontext = <DotLoader
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

    let sendButton = <Button
      disabled={this.state.loading}
      style={{ width: '100%' }}
      color="primary"
      block
      className="btn-round"
      type="button"
      onClick={this.inputValidation}
    >{buttontext}
    </Button>;
    let homeButton = <Nav style={{ justifyContent: 'center' }}>
      <NavItem >
        <Link to="/#/">
          <Button className="btn-icon btn-round" color="primary">
            <i className="fas fa-home"></i>
          </Button>
        </Link>
      </NavItem>
    </Nav>;

    if (Position === 0) {
      Card_Body =
        <CardBody>
          <FormGroup>
            <Label for="exampleEmail">{this.state.defaultMessage.Forms.email.title}:</Label>
            <InputGroup className={this.state.focused}>
              <InputGroupAddon addonType="prepend">
                <InputGroupText><i className="fas fa-at" style={{ marginRight: '10px' }}></i></InputGroupText>
              </InputGroupAddon>
              <Input
                type="text"
                name="email"
                placeholder={this.state.defaultMessage.Forms.email.title}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                onChange={this.handleChange}
              />
            </InputGroup>
          </FormGroup>
          <br />
          {sendButton}
          <br />{homeButton}
        </CardBody>
    } else if (Position === 1) {
      Card_Body = <CardBody>
        <CardHeader >{this.state.defaultMessage.Forms.token.info}</CardHeader><br />
        <fieldset disabled>
          <FormGroup>
            <Label for="exampleEmail">{this.state.defaultMessage.Forms.email.title}:</Label>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText><i className="fas fa-at" style={{ marginRight: '10px' }}></i></InputGroupText>
              </InputGroupAddon>
              <Input type="text" id="disabled" value={this.state.email} />
            </InputGroup>
          </FormGroup>
        </fieldset>
        <FormGroup>
          <Label for="exampleEmail">{this.state.defaultMessage.Forms.token.title}:</Label>
          <InputGroup className={this.state.focused}>
            <InputGroupAddon addonType="prepend">
              <InputGroupText><i className="fab fa-keycdn" style={{ marginRight: '10px' }}></i></InputGroupText>
            </InputGroupAddon>
            <Input
              type="text"
              name="token"
              placeholder={this.state.defaultMessage.Forms.token.title}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              onChange={this.handleChange}
            />
          </InputGroup>
        </FormGroup><br />
        {sendButton}
        <br />{homeButton}
      </CardBody>
    } else if (Position === 2) {
      Card_Body = <CardBody>
        <CardHeader >{this.state.defaultMessage.Forms.pass.title2}</CardHeader><br />
        <fieldset disabled>
          <FormGroup>
            <Label for="exampleEmail">{this.state.defaultMessage.Forms.email.title}:</Label>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText><i className="fas fa-at" style={{ marginRight: '10px' }}></i></InputGroupText>
              </InputGroupAddon>
              <Input type="text" id="disabled" value={this.state.email} />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <Label for="exampleEmail">{this.state.defaultMessage.Forms.token.title}:</Label>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText><i className="fab fa-keycdn" style={{ marginRight: '10px' }}></i></InputGroupText>
              </InputGroupAddon>
              <Input type="text" id="disabled" value={this.state.token} />
            </InputGroup>
          </FormGroup>
        </fieldset>
        <FormGroup>
          <Label for="examplePassword">{this.state.defaultMessage.Forms.pass.title}:</Label>
          <InputGroup className={this.state.focused}>
            <InputGroupAddon addonType="prepend">
              <InputGroupText><i className="fas fa-key" style={{ marginRight: '10px' }}></i></InputGroupText>
            </InputGroupAddon>
            <Input
              type="password"
              name="password"
              id="password"
              placeholder={this.state.defaultMessage.Forms.pass.title}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              autoComplete="off"
              onChange={this.handleChange}
            />
          </InputGroup>
        </FormGroup>
        <br />
        {sendButton}
        <br />{homeButton}
      </CardBody>
    } else {
      Card_Body = <CardBody>
        <fieldset disabled>
          <FormGroup>
            <Label for="exampleEmail">{this.state.defaultMessage.Forms.email.title}:</Label>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText><i className="fas fa-at" style={{ marginRight: '10px' }}></i></InputGroupText>
              </InputGroupAddon>
              <Input type="text" id="disabled" value={this.state.email} />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <Label for="exampleEmail">{this.state.defaultMessage.Forms.token.title}:</Label>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText><i className="fab fa-keycdn" style={{ marginRight: '10px' }}></i></InputGroupText>
              </InputGroupAddon>
              <Input type="text" id="disabled" value={this.state.token} />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <Label for="examplePassword">{this.state.defaultMessage.Forms.pass.title}:</Label>
            <InputGroup className={this.state.focused}>
              <InputGroupAddon addonType="prepend">
                <InputGroupText><i className="fas fa-key" style={{ marginRight: '10px' }}></i></InputGroupText>
              </InputGroupAddon>
              <Input type="password" id="disabled" value={this.state.password} />
            </InputGroup>
          </FormGroup>
        </fieldset>
        <br />{homeButton}
      </CardBody>
    }

    return (
      <>
        <Row>
          <div class="notranslate">
            <div className="react-notification-alert-container">
              <NotificationAlert ref="notificationAlert" />
            </div>
            <Col className="col_center_login" md="4">
              <Card className="card-user">
                <CardBody>
                  <CardText />
                  <div className="author">
                    <div className="block block-one" />
                    <div className="block block-two" />
                    <div className="block block-three" />
                    <div className="block block-four" />
                    <a href="/#/" >
                      <img
                        alt="..."
                        className="avatar-logo"
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
                  <form><br />
                    <Card>
                      <Stepper
                        activeColor={"#750f0f"}
                        completeColor={"#c45858"}
                        steps={this.state.steps}
                        activeStep={this.state.stepPosition} />
                      <CardBody>
                        {Card_Body}
                      </CardBody>
                    </Card>
                  </form>
                </CardBody>
              </Card>
            </Col>
          </div>
        </Row>
      </>
    );
  }
}

export default ForgotPassword;
