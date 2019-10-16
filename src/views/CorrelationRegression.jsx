import React from "react";
import Stepper from 'react-stepper-horizontal';
import { TagInputNaN } from '../components/reactjs-tag-input'
import { MDBRow, MDBCol } from 'mdbreact';
import {
  Alert,
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
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';

const data = [
  { x: 100, y: 200, z: 200 },
  { x: 120, y: 100, z: 260 },
  { x: 170, y: 300, z: 400 },
  { x: 140, y: 250, z: 280 },
  { x: 150, y: 400, z: 500 },
  { x: 110, y: 280, z: 200 },
];


class CorrelationRegression extends React.Component {
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
      VarX: "",
      VarY: "",
      message: this.props.location.state ? this.props.location.state.message : '',
      selectedOption: ""
    };
    this.onTagsChangedX = this.onTagsChangedX.bind(this);
    this.onTagsChangedY = this.onTagsChangedY.bind(this);
    this.toggle = this.toggle.bind(this);
  };

  toggle() {
    if (this.state.selectedOption === "option1") {
      this.setState(state => ({ collapse: !state.collapse }));
    }
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
    var Position = this.state.stepPosition;
    this.setState({
      collapse: false,
    });
    if (steps === 1 && Position < this.state.steps.length - 1)
      if (this.inputValidation()) {
        return this.setState({ stepPosition: Position += + 1 });
      }
    if (steps !== 1 && Position > 0)
      return this.setState({ stepPosition: Position += - 1 });
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  inputValidation = () => {
    this.colorAlert = 'danger';
    this.setState({
      visible: true,
      message: ''
    });
    if (this.state.stepPosition === 0) {
      if (this.state.VarX === null || this.state.VarX.trim() === "") {
        this.setState({ message: 'Name of independent variable cannot be blank' });
        return false;
      }
      else if (this.state.VarY === null || this.state.VarY.trim() === "") {
        this.setState({ message: 'Name of dependent variable cannot be blank' });
        return false;
      }
      else {
        this.setState({ message: '' });
        return true;
      }
    }
    else if (this.state.stepPosition === 1) {
      if (this.state.tagsX === null || this.state.tagsX.length === 0) {
        this.setState({ message: 'Invalid values for independent variable' });
        return false;
      }
      else if (this.state.tagsY === null || this.state.tagsY.length === 0) {
        this.setState({ message: 'Invalid values for dependent variable' });
        return false;
      }
      else if (this.state.tagsY.length !== this.state.tagsX.length) {
        this.setState({ message: 'The amount of values of both variables must be the same' });
        return false;
      }
      else {
        this.setState({ message: '' });
        return true;
      }
    }
    else if (this.state.stepPosition === 2) {

    }
  };

  onDismiss = () => {
    this.setState({
      visible: false,
      message: ''
    });
  };

  render() {
    let colorAlert;
    let button = [];
    let Position = this.state.stepPosition;
    let Card_Body;
    const options = {
      theme: "dark2",
      animationEnabled: true,
      zoomEnabled: true,
      title: {
        text: "Ice Cream Sales vs Temperature"
      },
      axisX: {
        title: "Temperature (in °C)",
        suffix: "°C",
        crosshair: {
          enabled: true,
          snapToDataPoint: true
        }
      },
      axisY: {
        title: "Sales",
        includeZero: false,
        crosshair: {
          enabled: true,
          snapToDataPoint: true
        }
      },
      data: [{
        type: "scatter",
        markerSize: 15,
        toolTipContent: "<b>Temperature: </b>{x}°C<br/><b>Sales: </b>{y}",
        dataPoints: [
          { x: 14.2, y: 215 },
          { x: 12.9, y: 175 },
          { x: 16.4, y: 325 },
          { x: 26.9, y: 635 },
          { x: 32.5, y: 464 },
          { x: 22.1, y: 522 },
          { x: 19.4, y: 412 },
          { x: 25.1, y: 614 },
          { x: 34.9, y: 374 },
          { x: 28.7, y: 625 },
          { x: 23.4, y: 544 },
          { x: 31.4, y: 502 },
          { x: 40.8, y: 262 },
          { x: 37.4, y: 312 },
          { x: 42.3, y: 202 },
          { x: 39.1, y: 302 },
          { x: 17.2, y: 408 }
        ]
      }]
    }
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
      Card_Body = <CardBody style={{ marginLeft: '10%', marginRight: '10%' }}>
        {
          this.state.message !== '' ? (
            <Alert
              isOpen={this.state.visible}
              toggle={this.onDismiss}
              color={this.colorAlert} className="text-center">{this.state.message}</Alert>
          ) : ''}
        <CardTitle>Name of the independent variable
            (X<sub>i</sub>):</CardTitle>
        <Input
          type="text"
          name="VarX"
          value={this.state.VarX}
          placeholder="Xi name"
          onChange={this.handleChange}
        />
        <br /><CardTitle>Name of the dependent variable
                (Y<sub>i</sub>):</CardTitle>
        <Input
          type="text"
          name="VarY"
          value={this.state.VarY}
          placeholder="Yi name"
          onChange={this.handleChange}
        />
        {/* <ScatterChart
          width={400}
          height={400}
          margin={{
            top: 20, right: 20, bottom: 20, left: 20,
          }}
        >
          <CartesianGrid />
          <XAxis type="number" dataKey="x" name="stature" unit="cm" />
          <YAxis type="number" dataKey="y" name="weight" unit="kg" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="A school" data={data} fill="#8884d8" />
        </ScatterChart> */}
        <br />
      </CardBody>
    } else if (Position === 1) {
      Card_Body = <CardBody style={{ marginLeft: '10%', marginRight: '10%' }}>
        {
          this.state.message !== '' ? (
            <Alert
              isOpen={this.state.visible}
              toggle={this.onDismiss}
              color={this.colorAlert} className="text-center">{this.state.message}</Alert>
          ) : ''}
        <CardTitle>X<sub>i</sub> - {this.state.VarX}:</CardTitle>
        <TagInputNaN
          tagStyle={`background: linear-gradient(to bottom right, #550300, #d32a23, #550300);`}
          placeholder="Independent variable values"
          tags={this.state.tagsX}
          onTagsChanged={this.onTagsChangedX} />
        <br /><CardTitle>Y<sub>i</sub>  - {this.state.VarY}:</CardTitle>
        <TagInputNaN
          tagStyle={`background: linear-gradient(to bottom right, #550300, #d32a23, #550300);`}
          placeholder="Dependent variable values"
          tags={this.state.tagsY}
          onTagsChanged={this.onTagsChangedY} />
      </CardBody>
    } else if (Position === 2) {
      Card_Body = <CardBody style={{ marginLeft: '10%', marginRight: '10%' }}>
        <Container >
          <MDBRow className="mx-auto" >
            <MDBCol >
              <CardTitle>X<sub>i</sub> - {this.state.VarX}:</CardTitle>
              <TagInputNaN
                addTagOnEnterKeyPressed={false}
                tagStyle={`background: linear-gradient(to bottom left, #550300, #d32a23, #550300);`}
                inputStyle={`display: none;`}
                tagDeleteStyle={`display: none;`}
                tags={this.state.tagsX}
                onTagsChanged={this.onTagsChangedX} /><br /><br />
              <CardTitle>Y<sub>i</sub>  - {this.state.VarY}:</CardTitle>
              <TagInputNaN
                addTagOnEnterKeyPressed={false}
                tagStyle={`background: linear-gradient(to bottom left, #550300, #d32a23, #550300);`}
                inputStyle={`display: none;`}
                tagDeleteStyle={`display: none;`}
                tags={this.state.tagsY}
                onTagsChanged={this.onTagsChangedY} />
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
                    <Stepper steps={this.state.steps}
                      activeStep={this.state.stepPosition}
                      activeColor={"#750f0f"}
                      completeColor={"#c45858"} />
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