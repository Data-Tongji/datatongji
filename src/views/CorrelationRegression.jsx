import React from "react";
import Stepper from 'react-stepper-horizontal';
import { TagInputNaN } from '../components/reactjs-tag-input'
import { MDBRow, MDBCol } from 'mdbreact';

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Collapse,
  Container,
  Col,
  FormGroup,
  Input,
  Label,
  Row,
  Table,
} from "reactstrap";
import { retornaSoma } from './Calculate/Correlation';
import { get } from "http";

class CorrelationRegression extends React.Component {
  state = {
    VarX: '',
    VarY: '',
    tagsX: [],
    tagsY: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      steps: [
        { title: '' },
        { title: '' },
        { title: '' },
        { title: '' }],
      tagsX: [],
      tagsY: [],
      stepPosition: 0,
      focused: "",
      collapse: false,
      selectedOption: ""
    };
    this.onTagsChangedX = this.onTagsChangedX.bind(this);
    this.onTagsChangedY = this.onTagsChangedY.bind(this);
    this.toggle = this.toggle.bind(this);
  };

  toggle() {
    if (this.state.selectedOption==="option1"){
    this.setState(state => ({ collapse: !state.collapse }));}
  }

  onTagsChangedX(tagsX) {
    this.setState({ tagsX });
  };

  onTagsChangedY(tagsY) {
    this.setState({ tagsY });
  };

  mostraresult() {
    // document.getElementById('SomaY').value = 'TESTE';
  }

  handleOptionChange = changeEvent => {
    this.setState({
      selectedOption: changeEvent.target.value
    });
  };

  positionStep = (steps) => {
    var Position = this.state.stepPosition
    if (steps === 1 && Position < this.state.steps.length - 1)
      if (this.valida()) {
        return this.setState({ stepPosition: Position += + 1 });
      }
    if (steps !== 1 && Position > 0)
      return this.setState({ stepPosition: Position += - 1 });
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  valida = () => {
    if (this.state.stepPosition === 0) {
      if (this.state.VarX == null || this.state.VarX.trim() === "") {
        this.setState({ message: 'Preencha o campo variável independente' });
        return false;
      }
      else if (this.state.VarY == null || this.state.VarY.trim() === "") {
        this.setState({ message: 'Preencha o campo variável independente' });
        return false;
      }
      else {
        this.setState({ message: '' });
        return true;
      }
    }
    else if (this.state.stepPosition === 1) {
      if (this.state.tagsX === null || this.state.tagsX.length === 0) {
        this.setState({ message: 'Digite os valores das variáveis independentes' });
        return false;
      }
      else if (this.state.tagsY === null || this.state.tagsY.length === 0) {
        this.setState({ message: 'Digite os valores das variáveis dependentes' });
        return false;
      }
      else if (this.state.tagsY.length !== this.state.tagsX.length) {
        this.setState({ message: 'A quantidade de valores inseridas nas duas variáveis deve ser igual.' });
        return false;
      }
      else {
        this.setState({ message: '' });
        return true;
      }
    }
    else if (this.state.stepPosition === 2) {
      if (this.state.password == null || this.state.password.trim() === "") {
        this.setState({ message: 'Preencha o campo senha' });
      }
      else {
        this.setState({ message: '' });
        this.ResetPass();
      }
    }
  };

  render() {
    let button = [];
    let Position = this.state.stepPosition;
    let Card_Body;

    let content = this.state.tagsX;

    button.push(
      <Button
        className="btn-round btn-icon"
        color="primary"
        onClick={() => this.positionStep(0)}>
        <i className="tim-icons icon-double-left" />
      </Button>
    );
    button.push(
      <Button
        className="btn-round btn-icon"
        color="primary"
        onClick={() => this.positionStep(1)}>
        <i className="tim-icons icon-double-right" />
      </Button>);
    if (Position === 0) {
      Card_Body = <CardBody style={{ marginLeft: '10%', marginRight: '10%' }}><CardTitle>Digite o nome da variável independente
            (X<sub>i</sub>):</CardTitle>
        <Input
          type="text"
          name="VarX"
          value={this.state.VarX}
          placeholder="Nome da variável independente Xi"
          onChange={this.handleChange}
        />
        <br /><CardTitle>Digite o nome da variável dependente
                (Y<sub>i</sub>):</CardTitle>
        <Input
          type="text"
          name="VarY"
          value={this.state.VarY}
          placeholder="Nome da variável dependente Yi"
          onChange={this.handleChange}
        />
        <br />
      </CardBody>
    } else if (Position === 1) {
      Card_Body = <CardBody style={{ marginLeft: '10%', marginRight: '10%' }}>
        <CardTitle>X<sub>i</sub> - {this.state.VarX}:</CardTitle>
        <TagInputNaN placeholder="Valores da variável independente" tags={this.state.tagsX} onTagsChanged={this.onTagsChangedX} />

        <br /><CardTitle>Y<sub>i</sub>  - {this.state.VarY}:</CardTitle>
        <TagInputNaN placeholder="Valores da variável dependente" tags={this.state.tagsY} onTagsChanged={this.onTagsChangedY} />

      </CardBody>
    } else if (Position === 2) {

      Card_Body = <CardBody style={{ marginLeft: '10%', marginRight: '10%' }}>
        <Container >
          <MDBRow className="mx-auto" >
            <MDBCol >
              <CardTitle>X<sub>i</sub> - {this.state.VarX}:</CardTitle>
              <TagInputNaN placeholder="Valores da variável independente" addTagOnEnterKeyPressed={false} tagStyle={`
                background: red;`} inputStyle={`
                display: none;
              `} tagDeleteStyle={`
                display: none;
              `} tags={this.state.tagsX} onTagsChanged={this.onTagsChangedX} /><br /><br />
              <CardTitle>Y<sub>i</sub>  - {this.state.VarY}:</CardTitle>
              <TagInputNaN placeholder="Valores da variável dependente" addTagOnEnterKeyPressed={false} tagStyle={`
                background: red;`} inputStyle={`
                display: none;
              `} tagDeleteStyle={`
                display: none;
              `} tags={this.state.tagsY} onTagsChanged={this.onTagsChangedY} />
            </MDBCol>
            <MDBCol >
              <form>

                <div className="form-check">
                  <label>
                    <input
                      type="radio"
                      name="react-tips"
                      value="option1"
                      checked={this.state.selectedOption === "option1"}
                      className="form-check-input"
                      onChange={this.handleOptionChange}
                    />
                    Correlação
                  </label>
                </div>

                <div className="form-check">
                  <label>
                    <input
                      type="radio"
                      name="react-tips"
                      value="option2"
                      checked={this.state.selectedOption === "option2"}
                      className="form-check-input"
                      onChange={this.handleOptionChange}
                    />
                    Regressão
                  </label>
                </div>
                <div className="form-group">
                  <Button color="primary" onClick={this.toggle} >Exibir Tabela</Button>
                </div>
              </form>
            </MDBCol>
          </MDBRow>
        </Container>
        <br />

        {/* <Button color="success" onClick={this.mostraresult}>Calcular</Button> */}

        <Collapse isOpen={this.state.collapse}>
        <Table responsive>
          
          <thead>
            <tr>
              <th>#</th>
              <th>Table heading</th>
              <th>Table heading</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>Table cell</td>
              <td>Table cell</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Table cell</td>
              <td>Table cell</td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>Table cell</td>
              <td>Table cell</td>
            </tr>
          </tbody>
        </Table>
        </Collapse>       
        <br />


      </CardBody>
    } else {
      // cardBory =


      button.push(
        <Button color="success">Success</Button>
      )

    }
    return (
      <>

        <div className="content">
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>Correlação e Regressão</CardHeader>
                <CardBody>
                  <Card>
                    <Stepper steps={this.state.steps
                    } activeStep={this.state.stepPosition} />
                    <CardBody>

                      {Card_Body}

                      {button[0]}
                      {button[1]}
                      {button[2]}
                    </CardBody>


                  </Card>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
};

export default CorrelationRegression;