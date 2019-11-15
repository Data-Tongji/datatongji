
import React from "react";
import Stepper from 'react-stepper-horizontal';
import { Link } from "react-router-dom";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Button,
  Alert,
  Card,
  Col,
  Row,
  CardText,
  Nav,
  NavItem,
  CardHeader,
  CardBody
} from "reactstrap";
import { DotLoader } from 'react-spinners';

export class ForgotPassword extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      message: this.props.location.state ? this.props.location.state.message : '',
      steps: [
        { title: '' },
        { title: '' },
        { title: '' },
        { title: '' }],
      stepPosition: 0,
      loading: false,
      focused: ""
    };
  }

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
      body: JSON.stringify({ "email": this.state.email }),
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
    };
    try {
      const response = await fetch('https://datatongji-backend.herokuapp.com/auth/forgot_password', requestInfo);
      if (response.ok) {
        this.setState({
          message: '',
          loading: false
        });
        this.positionStep(1);
        return;
      } else {
        throw new Error("User not found");
      }
    } catch (err) {
      this.colorAlert = 'danger';
      this.setState({
        message: err.message,
        loading: false
      });
    }
  }

  async ValidToken() {
    this.setState({ loading: true });
    const requestInfo = {
      method: 'POST',
      body: JSON.stringify({ "email": this.state.email, "token": this.state.token }),
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
    };
    try {
      const response = await fetch('https://datatongji-backend.herokuapp.com/auth/valid_token', requestInfo);
      if (response.ok) {
        this.setState({
          message: '',
          loading: false
        });
        this.positionStep(1);
        return;
      } else {
        throw new Error("Invalid token!");
      }
    } catch (err) {
      this.colorAlert = 'danger';
      this.setState({
        message: err.message,
        loading: false
      });
    }
  }

  async ResetPass() {
    this.setState({ loading: true });
    const requestInfo = {
      method: 'PUT',
      body: JSON.stringify({ "email": this.state.email, "token": this.state.token, "password": this.state.password }),
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
    };
    try {
      const response = await fetch('https://datatongji-backend.herokuapp.com/auth/reset_password', requestInfo);
      // var valid = await response.json();
      if (response.ok) {
        this.positionStep(1);
        this.colorAlert = 'success';
        this.setState({
          message: 'Success!',
          loading: false
        });
        return;
      } else {
        throw new Error("Error when changing the password!");
      }
    } catch (err) {
      this.colorAlert = 'danger';
      this.setState({
        message: err.message,
        loading: false
      });
    }
  }

  inputValidation = () => {
    this.colorAlert = 'danger';
    this.setState({ visible: true });
    if (this.state.stepPosition === 0) {
      if (this.state.email == null || this.state.email.trim() === "") {
        return this.setState({ message: 'Email field cannot be blank' });
      }
      else {
        this.setState({ message: '' });
        this.ForgotPass();
      }
    }
    else if (this.state.stepPosition === 1) {
      if (this.state.token == null || this.state.token.trim() === "") {
        return this.setState({ message: 'Token field cannot be blank' });
      }
      else {
        this.setState({ message: '' });
        this.ValidToken();
      }
    }
    else if (this.state.stepPosition === 2) {
      if (this.state.password == null || this.state.password.trim() === "") {
        return this.setState({ message: 'Password field cannot be blank' });
      }
      else {
        this.setState({ message: '' });
        this.ResetPass();
      }
    }
  };

  onDismiss = () => {
    this.setState({
      visible: false,
      message: ''
    });
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    let Position = this.state.stepPosition;
    let Card_Body;
    let colorAlert;

    let buttontext = 'Send';
    if (Position === 2) {
      buttontext = 'Change Password'
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
          <CardHeader >Email address</CardHeader><br />
          <InputGroup className={this.state.focused}>
            <InputGroupAddon addonType="prepend">
              <InputGroupText><i className="fas fa-at" style={{ marginRight: '10px' }}></i></InputGroupText>
            </InputGroupAddon>
            <Input
              type="text"
              name="email"
              placeholder="Email"
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              onChange={this.handleChange}
            />
          </InputGroup><br />
          {sendButton}
          <br />{homeButton}
        </CardBody>
    } else if (Position === 1) {
      Card_Body = <CardBody>
        <CardHeader >Check your email and inform us the token you received</CardHeader><br />
        <fieldset disabled>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText><i className="fas fa-at" style={{ marginRight: '10px' }}></i></InputGroupText>
            </InputGroupAddon>
            <Input type="text" id="disabled" value={this.state.email} />
          </InputGroup>
        </fieldset>
        <InputGroup className={this.state.focused}>
          <InputGroupAddon addonType="prepend">
            <InputGroupText><i className="fab fa-keycdn" style={{ marginRight: '10px' }}></i></InputGroupText>
          </InputGroupAddon>
          <Input
            type="text"
            name="token"
            placeholder="Token"
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onChange={this.handleChange}
          />
        </InputGroup><br />
        {sendButton}
        <br />{homeButton}
      </CardBody>
    } else if (Position === 2) {
      Card_Body = <CardBody>
        <CardHeader >Inform the new password</CardHeader><br />
        <fieldset disabled>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText><i className="fas fa-at" style={{ marginRight: '10px' }}></i></InputGroupText>
            </InputGroupAddon>
            <Input type="text" id="disabled" value={this.state.email} />
          </InputGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText><i className="fab fa-keycdn" style={{ marginRight: '10px' }}></i></InputGroupText>
            </InputGroupAddon>
            <Input type="text" id="disabled" value={this.state.token} />
          </InputGroup>
        </fieldset>
        <InputGroup className={this.state.focused}>
          <InputGroupAddon addonType="prepend">
            <InputGroupText><i className="fas fa-key" style={{ marginRight: '10px' }}></i></InputGroupText>
          </InputGroupAddon>
          <Input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onChange={this.handleChange}
          />
        </InputGroup><br />
        {sendButton}
        <br />{homeButton}
      </CardBody>
    } else {
      Card_Body = <CardBody>
        <CardHeader >Your Password has been changed, you can log in now!</CardHeader> <br />
        <br />{homeButton}
      </CardBody>
    }

    return (
      <>
        <Row>
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
                  </a>
                </div>
                <form>
                  <Card>
                    <Stepper
                      activeColor={"#750f0f"}
                      completeColor={"#c45858"}
                      steps={this.state.steps}
                      activeStep={this.state.stepPosition} />
                    <CardBody>{
                      this.state.message !== '' ? (
                        <Alert
                          isOpen={this.state.visible}
                          toggle={this.onDismiss}
                          color={this.colorAlert}
                          className="text-center">{this.state.message}</Alert>
                      ) : ''}
                      {Card_Body}
                    </CardBody>
                  </Card>
                </form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </>
    );
  }
}

export default ForgotPassword;
