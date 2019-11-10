
import React from "react";
import Stepper from 'react-stepper-horizontal';
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
  NavLink,
  CardHeader,
  CardBody
} from "reactstrap";

export class ForgotPassword extends React.Component {
  state = {
    email: '',
    token: '',
    password: '',
  };

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
        throw new Error("login e/ou senha incorretos!");
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
        throw new Error("token incorreto ou expirado!");
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
    // console.log(JSON.stringify({ "email": this.state.email, "token": this.state.token, "password": this.state.password }));
    const requestInfo = {
      method: 'POST',
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
        throw new Error("erro ao alterar senha!");
      })
      .then(valid => {
        console.log(valid);
        this.positionStep(1);
        return;
      })
      .catch(e => {
        this.setState({ message: e.message });
      });

  }

  valida = () => {
    if (this.state.stepPosition === 0) {
      if (this.state.email == null || this.state.email.trim() === "") {
        this.setState({ message: 'preencha o campo e-mail' });
      }
      else {
        this.setState({ message: '' });
        this.ForgotPass();
      }
    }
    else if (this.state.stepPosition === 1) {
      if (this.state.token == null || this.state.token.trim() === "") {
        this.setState({ message: 'preencha o campo token' });
      }
      else {
        this.setState({ message: '' });
        this.ValidToken();
      }
    }
    else if (this.state.stepPosition === 2) {
      if (this.state.password == null || this.state.password.trim() === "") {
        this.setState({ message: 'preencha o campo senha' });
      }
      else {
        this.setState({ message: '' });
        this.ResetPass();
      }
    }


  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    let button = [];
    let Position = this.state.stepPosition;
    let Card_Body;


    if (Position === 0) {
      Card_Body =
        <CardBody>
          <CardHeader style={{ textAlign: 'center' }} >Informe o e-mail cadastrado:</CardHeader><br />
          <InputGroup className={this.state.focused}>
            <InputGroupAddon addonType="prepend">
              <InputGroupText><i className="fas fa-at" style={{ marginRight: '10px' }}></i></InputGroupText>
            </InputGroupAddon>
            <Input
              type="text"
              name="email"
              placeholder="E-mail"
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              onChange={this.handleChange}
            />
          </InputGroup>{
            this.state.message !== '' ? (
              <Alert color='danger' className="text-center">{this.state.message}</Alert>
            ) : ''}
          <Button style={{ width: '100%' }} color="orange" type="button" onClick={this.valida}>
            Enviar
           </Button>
        </CardBody>
    } else if (Position === 1) {
      Card_Body = <CardBody>
        <CardHeader style={{ textAlign: 'center' }} >Informe o token recebido no seu e-mail.</CardHeader><br />
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
        </InputGroup>{
          this.state.message !== '' ? (
            <Alert color='danger' className="text-center">{this.state.message}</Alert>
          ) : ''}
        <Button style={{ width: '100%' }} color="orange" type="button" onClick={this.valida}>
          Enviar
          </Button>
      </CardBody>
    } else if (Position === 2) {
      Card_Body = <CardBody>
        <CardHeader style={{ textAlign: 'center' }} >Informe a nova senha.</CardHeader><br />
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
            placeholder="Senha"
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onChange={this.handleChange}
          />
        </InputGroup>{
          this.state.message !== '' ? (
            <Alert color='danger' className="text-center">{this.state.message}</Alert>
          ) : ''}
        <Button style={{ width: '100%' }} color="primary" type="button" onClick={this.ResetPass}>
          Alterar Senha
        </Button>

      </CardBody>
    } else {
      Card_Body = <CardBody>
        <CardHeader style={{ textAlign: 'center' }} >Senha alterada com sucesso!</CardHeader> <br />
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
                  <a href="#pablo" onClick={e => e.preventDefault()}>
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
                    <CardBody>
                      {Card_Body}
                      {button[0]}
                      {button[1]}
                      {button[2]}
                      <Nav style={{ justifyContent: 'center' }}>
                        <NavItem >
                          <NavLink href="/#/"><i className="fas fa-home" style={{ marginRight: '10px' }}></i></NavLink>
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
