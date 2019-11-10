
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
  Label,
  Nav,
  NavItem,
  CardHeader,
  CardBody
} from "reactstrap";

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
      focused: "",
      modalDemo: false
    };
    this.toggleModalDemo = this.toggleModalDemo.bind(this);
  }

  toggleModalDemo() {
    this.setState({
      modalDemo: !this.state.modalDemo
    });
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

  ForgotPass = () => {
    const requestInfo = {
      method: 'POST',
      body: JSON.stringify({ "email": this.state.email }),
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
    };

    fetch('https://datatongji-backend.herokuapp.com/auth/forgot_password', requestInfo)
      .then(response => {
        if (response.ok) {
          this.setState({ message: '' });
          return response.json();
        }
        throw new Error("Wrong credentials!");
      })
      .then(token => {
        console.log(token);
        this.positionStep(1);
        return;
      })
      .catch(e => {
        this.setState({ message: e.message });
      });

  }

  ValidToken = () => {
    const requestInfo = {
      method: 'POST',
      body: JSON.stringify({ "email": this.state.email, "token": this.state.token }),
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
    };

    fetch('https://datatongji-backend.herokuapp.com/auth/valid_token', requestInfo)
      .then(response => {
        if (response.ok) {
          this.setState({ message: '' });
          return response.json();
        }
        throw new Error("Invalid token!");
      })
      .then(token => {
        console.log(token);
        this.positionStep(1);
        return;
      })
      .catch(e => {
        this.setState({ message: e.message });
      });

  }

  ResetPass = () => {
    const requestInfo = {
      method: 'PUT',
      body: JSON.stringify({ "email": this.state.email, "token": this.state.token, "password": this.state.password }),
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
    };

    fetch('https://datatongji-backend.herokuapp.com/auth/reset_password', requestInfo)
      .then(response => {
        if (response.ok) {
          this.setState({ message: '' });
          return response.json();
        }
        throw new Error("Error when changing the password");
      })
      .then(valid => {
        this.positionStep(1);
        this.colorAlert = 'success';
        this.setState({ message: 'Success!' });
        return;
      })
      .catch(e => {
        this.setState({ message: e.message });
      });

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
    let button = [];
    let Position = this.state.stepPosition;
    let Card_Body;
    let colorAlert;


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
          </InputGroup>

          <Button
            style={{ width: '100%' }}
            color="primary"
            block
            className="btn-round"
            type="button"
            onClick={this.inputValidation}
          >Send
          </Button>
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
        </InputGroup>
        <Button
          style={{ width: '100%' }}
          color="primary"
          block
          className="btn-round"
          type="button"
          onClick={this.inputValidation}>Send</Button>
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
        </InputGroup>
        <Button style={{ width: '100%' }} color="primary" type="button" onClick={this.inputValidation}>
          Change Password
        </Button>

      </CardBody>
    } else {
      Card_Body = <CardBody>
        <CardHeader >Your Password has been changed! You can log in now.</CardHeader> <br />
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
                      {button[0]}
                      {button[1]}
                      {button[2]}
                      <Nav style={{ justifyContent: 'center' }}>
                        <NavItem >
                          <Link to="/#/">
                            <Button className="btn-icon btn-round" color="primary">
                              <i className="fas fa-home"></i>
                            </Button>
                          </Link>
                        </NavItem>
                      </Nav>
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
