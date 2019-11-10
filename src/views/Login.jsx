
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

export class Login extends React.Component {

  state = {
    name: '',
    email: '',
    password: '',
    register: false
  };
  constructor(props) {
    super(props)
    this.state = {
      message: this.props.location.state ? this.props.location.state.message : '',
    };
  };

  signIn = () => {
    const requestInfo = {
      method: 'POST',
      body: JSON.stringify({ "email": this.state.email, "password": this.state.password }),
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
    };
    fetch('http://localhost:8080/auth/authenticate', requestInfo)
      .then(response => {
        if (response.ok) {
          this.setState({ message: '' });
          return response.json();
        }
        this.colorAlert = 'danger';
        throw new Error(response.status === 400 ? 'User not found' : 'Invalid credentials');
      })
      .then(token => {
        localStorage.setItem('token', token);
        localStorage.setItem('valid', "OK");
        this.getUser(token);
        this.props.history.push("/admin/dashboard");
        return;
      })
      .catch(e => {
        this.colorAlert = 'danger';
        this.setState({ message: e.message });
      });

  };

  async getUser() {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8080/auth/get_user?token=${token}`)
    const responseJson = await response.json()
    localStorage.setItem('UserName', responseJson.user.name);
  };

  register = () => {
    const requestInfo = {
      method: 'POST',
      body: JSON.stringify({ "name": this.state.name, "email": this.state.email, "password": this.state.password }),
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
    };

    fetch('http://localhost:8080/auth/register', requestInfo)
      .then(response => {
        if (response.ok) {
          this.colorAlert = 'success';
          this.setState({ message: 'You have successfully registered, please sign in' });
          return response.json();
        }
        this.colorAlert = 'danger';
        throw new Error("User has already been registered");
      })
      .then(token => {
        localStorage.setItem('token', token);
        localStorage.setItem('valid', "OK");
        this.setState({ register: false });
        return;
      })
      .catch(e => {
        this.colorAlert = 'danger'
        this.setState({ message: e.message });
      });

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
        return this.setState({ message: 'Fill the name field correctly' });
      }
    }

    if (this.state.email == null || this.state.email.trim() === "") {
      return this.setState({ message: 'E-mail field cannot be blank' });
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
    let actionLoginText = 'Login';
    let nameLabel;

    if (this.state.register === true) {
      actionLoginText = "Cadastrar"
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
                  <a href="#pablo" onClick={e => e.preventDefault()}>
                    <img
                      alt="..."
                      className="avatar-logo"
                      src={require("assets/img/logoTong.png")}
                    />
                  </a>
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
                    <i class="fas fa-user-plus"></i>
                  </Button>
                  <Link to="/auth/forgotpassword">
                    <Button className="btn-icon btn-round" color="primary">
                      <i class="fas fa-unlock-alt"></i>
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
