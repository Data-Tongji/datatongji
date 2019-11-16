
import React from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  CardText,
  CardFooter,
  Button,
  Card,
  CardBody,
  FormGroup,
  Label,
  Input,
  Alert,
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
      loading: false,
      message: this.props.location.state ? this.props.location.state.message : '',
    };
    this.signIn = this.signIn.bind(this);
    this.register = this.register.bind(this);
  };

  async signIn() {
    this.setState({ loading: true });
    const requestInfo = {
      method: 'POST',
      body: JSON.stringify({ "email": this.state.email, "password": this.state.password }),
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
        this.getUserConfig(token);
        this.setState({
          message: '',
          loading: false
        });
        this.props.history.push("/admin/dashboard");
        return;
      } else {
        throw new Error(response.status === 400 ? 'User not found' : 'Invalid credentials');
      }
    } catch (e) {
      this.colorAlert = 'danger';
      this.setState({
        message: e.message,
        loading: false
      });
    }
  };

  async getUserConfig() {
    const token = localStorage.getItem('token');
    const response = await fetch(`https://datatongji-backend.herokuapp.com/auth/get_user_cofig?token=${token}`);
    const responseJson = await response.json();

    localStorage.setItem('background', responseJson.backgroundColor);
    localStorage.setItem('sidebarColor', responseJson.sidebarColor);
    localStorage.setItem('defaultLanguage', responseJson.defaultLanguage);
  };

  async register() {
    this.setState({ loading: true });
    const requestInfo = {
      method: 'POST',
      body: JSON.stringify({ "name": this.state.name, "email": this.state.email, "password": this.state.password }),
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
    };
    try {
      const response = await fetch('https://datatongji-backend.herokuapp.com/auth/register', requestInfo);
      if (response.ok) {
        this.colorAlert = 'success';
        this.setState({
          message: 'You have successfully registered, please sign in',
          register: false,
          loading: false
        });
        return;
      } else {
        throw new Error("User has already been registered");
      }
    }
    catch (e) {
      this.colorAlert = 'danger';
      this.setState({
        message: e.message,
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
    this.colorAlert = 'danger';
    this.setState({ visible: true });
    if (this.state.register === true) {
      if (this.state.name == null || this.state.name.trim() === "") {
        return this.setState({ message: 'Name field cannot be blank' });
      }
    }

    if (this.state.email == null || this.state.email.trim() === "") {
      return this.setState({ message: 'Email field cannot be blank' });
    }
    else if (this.state.password == null || this.state.password.trim() === "") {
      return this.setState({ message: 'Password field cannot be blank' });
    }
    else {
      this.setState({ message: '' });
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


  onDismiss = () => {
    this.setState({
      visible: false,
      message: ''
    });
  };

  render() {
    let register;
    let colorAlert;
    let actionLoginText = 'Log in';
    let nameLabel;
    document.body.classList.remove("white-content")
    if (this.state.register === true) {
      actionLoginText = "Sign Up"
      nameLabel = <Label for="exampleEmail">User Name</Label>
      register = <InputGroup className={this.state.focused}>
        <InputGroupAddon addonType="prepend">
          <InputGroupText>
            <i className="tim-icons icon-single-02" />
          </InputGroupText>
        </InputGroupAddon>
        <Input
          type="text"
          name="name"
          placeholder="Nome"
          onFocus={this.onFocus}
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
                  />
                </div>
                <FormGroup>
                  {
                    this.state.message !== '' ? (
                      <Alert
                        isOpen={this.state.visible}
                        toggle={this.onDismiss}
                        color={this.colorAlert} className="text-center">{this.state.message}</Alert>
                    ) : ''}
                  {nameLabel}
                  {register}
                  <Label for="exampleEmail">Email address</Label>

                  <Input
                    type="email"
                    name="email"
                    id="exampleEmail"
                    placeholder="Enter email"
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
              <CardFooter>
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
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </>
    );
  }
}

export default Login;
