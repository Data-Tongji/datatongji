import React from "react";
import { TagInputNaN } from '../components/reactjs-tag-input';

import { Save, AddCircle } from 'grommet-icons';
import { Line, Scatter } from 'react-chartjs-2';
import { Row, Col } from 'react-bootstrap';
import Papa from 'papaparse';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Collapse,
  Container,
  FormGroup,
  Input,
  Label,
  ListGroup,
  ListGroupItem,
  Modal,
  ModalBody,
  ModalFooter,
  Nav,
  NavItem,
  NavLink,
  Table,
} from "reactstrap";
// import {
//   ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip
// } from 'recharts';
import csvicon from '../assets/img/csv.svg';
import '../assets/css/csv.css';

const data = {
  labels: ['Scatter'],
  datasets: [
    {
      label: 'My First dataset',
      fill: false,
      backgroundColor: 'rgba(75,192,192,0.4)',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 3,
      pointHoverRadius: 8,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 5,
      pointRadius: 4,
      pointHitRadius: 13,
      data: [
        { x: 65, y: 75 },
        { x: 59, y: 49 },
        { x: 80, y: 90 },
        { x: 81, y: 29 },
        { x: 56, y: 36 },
        { x: 55, y: 25 },
        { x: 40, y: 18 },
      ]
    }
  ]
};


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
      focused: '',
      collapse: false,
      VarX: '',
      VarY: '',
      modalDemo: false,
      modalHelp: false,
      btnSave: true,
      correlation: '',
      acceptedFiles: '',
      regression: {
        aCoef: '',
        iPoint: ''
      },
      dispcsv: false,
      csv: null,
      csvfile: undefined,
      message: this.props.location.state ? this.props.location.state.message : ''
    };
    this.onTagsChangedX = this.onTagsChangedX.bind(this);
    this.onTagsChangedY = this.onTagsChangedY.bind(this);
    this.toggleModalDemo = this.toggleModalDemo.bind(this);
    this.toggleModalHelp = this.toggleModalHelp.bind(this);
    this.updateData = this.updateData.bind(this);
    this.fileInput = React.createRef();
  };

  onTagsChangedX(tagsX) {
    this.setState({ tagsX });
    if (this.state.collapse) {
      this.setState({
        collapse: false,
        btnSave: true
      })
    };
  };

  onTagsChangedY(tagsY) {
    this.setState({ tagsY });
    if (this.state.collapse) {
      this.setState({
        collapse: false,
        btnSave: true
      })
    };
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  toggleModalDemo() {
    this.setState({
      modalDemo: !this.state.modalDemo
    });
  };

  toggleModalHelp() {
    this.setState({
      modalHelp: !this.state.modalHelp
    });
  };

  ResultCollapse() {
    this.setState(state => ({ collapse: !this.state.collapse }));
    this.SendData();
  };

  SendData = () => {
    var tagsx = [];
    var tagsy = [];
    for (var i = 0; i < this.state.tagsX.length; i++) {
      tagsx.splice(i, 0, this.state.tagsX[i].displayValue);
      tagsy.splice(i, 0, this.state.tagsY[i].displayValue);
    }
    const requestInfo = {
      method: 'POST',
      body: JSON.stringify({
        "X": tagsx,
        "Y": tagsy
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      }),
    };
    fetch(`https://datatongji-backend.herokuapp.com/correlation/corrreg`, requestInfo)
      .then(response => {
        if (response.ok) {
          this.setState({ message: '' });
          return response.json();
        }
        throw new Error("Failure!");
      }).then(result => {
        this.setState({
          btnSave: false,
          correlation: result.distribution.correlation,
          regression: result.distribution.regression
        });
      })
      .catch(e => {
        this.setState({
          message: e.message,
          btnSave: true
        });
      });
  };

  inputValidation = () => {
    this.colorAlert = 'danger';
    this.setState({
      visible: true,
      btnSave: true
    });
    if (this.state.VarX === null || this.state.VarX.trim() === "") {
      this.setState({ message: 'Name of independent variable cannot be blank' });
      return false;
    }
    else if (this.state.VarY === null || this.state.VarY.trim() === "") {
      this.setState({ message: 'Name of dependent variable cannot be blank' });
      return false;
    }
    else if (this.state.tagsX === null || this.state.tagsX.length === 0) {
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
      if (!this.state.collapse) {
        this.ResultCollapse();
      } else {
        this.SendData();
      }
    }
  };

  onDismiss = () => {
    this.setState({
      visible: false,
      message: ''
    });
  };

  onDismissCSV = () => {
    this.setState({
      csvfile: '',
      csv: '',
      acceptedFiles: '',
      csvdata: null
    });
  };

  handlecsvChange = event => {
    if (event.target.files[0].name.includes('.csv')) {
      this.setState({
        csvfile: event.target.files[0],
        csv: 'has-csv',
        acceptedFiles: event.target.files[0].name,
        dispcsv: false,
      });
    } else {
      this.colorAlert = 'danger';
      this.setState({
        visible: true,
        message: 'Invalid type of file, only .csv are accepted'
      });
    }
  };

  importCSV = () => {
    const { csvfile } = this.state;
    Papa.parse(csvfile, {
      complete: this.updateData,
      header: true
    });
  };

  updateData(result) {
    var data = result.data;
    var keys = Object.keys(data[0]);
    var arrfull = [];
    var pass = true;
    if (keys.length !== 2) {
      this.colorAlert = 'danger';
      this.setState({
        visible: true,
        message: 'Format of file not compatible, please download an example file and try first'
      });
    } else {
      for (var i = 0; i < data.length; i++) {
        Object.keys(data[0]).forEach(function (key) {
          if (data[i][key] !== undefined) {
            var inputValue = data[i][key];
            inputValue = inputValue.replace(/,{1,}/g, '.');
            inputValue = inputValue.replace(/\s{2,}/g, ' ');
            inputValue = inputValue.replace(/\.{2,}/g, '.');
            if (parseFloat(inputValue)) {
              arrfull.push(parseFloat(inputValue));
            } else if (inputValue.match(/[^,.\d]/)) {
              pass = false;
            }
          }
        })
      };
      if (arrfull.length % 2 === 0 || pass) {
        this.setState({ csvdata: data });
        if (this.state.VarX === '') {
          this.setState({ VarX: keys[0] });
        }
        if (this.state.VarY === '') {
          this.setState({ VarY: keys[1] });
        }
        let aux = [];
        var pos = 1;

        if (this.state.tagsX.length > 0) {
          aux = this._toConsumableArray(this.state.tagsX);
          pos = this.state.tagsX.length
        }
        for (var i = 0; i < arrfull.length; i++) {
          if (i % 2 === 0) {
            aux = [].concat(aux, [{
              index: pos,
              displayValue: arrfull[i]
            }]);
            pos++;
          }
        }
        this.setState({ tagsX: aux });
        aux = [];
        pos = 1;
        if (this.state.tagsY.length > 0) {
          aux = this._toConsumableArray(this.state.tagsY);
          pos = this.state.tagsY.length
        }
        for (var i = 0; i < arrfull.length; i++) {
          if (i % 2 > 0) {
            aux = [].concat(aux, [{
              index: pos,
              displayValue: arrfull[i]
            }]);
            pos++;
          }
        }
        this.setState({
          tagsY: aux,
          dispcsv: true
        });
      }
      else {
        this.colorAlert = 'danger';
        this.setState({
          visible: true,
          message: 'There is a wrong cell data on your file, please fix it first'
        });
      }
    };
  };

  _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } };

  render() {
    let colorAlert;
    const fileInputKey = this.state.acceptedFiles.value ? '' : +new Date();
    let tagcsvX = null;
    let tagcsvY = null;
    if (this.state.dispcsv) {
      tagcsvX =
        (
          <TagInputNaN
            tagStyle={`background: linear-gradient(to bottom right, #550300, #d32a23, #550300);`}
            placeholder="Independent variable values"
            tags={this.state.tagsX}
            onTagsChanged={this.onTagsChangedX}
          />)
      tagcsvY =
        (
          <TagInputNaN
            tagStyle={`background: linear-gradient(to bottom right, #550300, #d32a23, #550300);`}
            placeholder="Independent variable values"
            tags={this.state.tagsY}
            onTagsChanged={this.onTagsChangedY}
          />)
    } else {
      tagcsvX = null;
      tagcsvY = null;
    };
    let ModalHelp = (<Modal isOpen={this.state.modalHelp} toggle={this.toggleModalHelp}>
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLongTitle">
          Need information?
        </h5>
        <button
          type="button"
          className="close"
          data-dismiss="modal"
          aria-hidden="true"
          onClick={this.toggleModalLong}
        >
          <i className="tim-icons icon-simple-remove" />
        </button>
      </div>
      <ModalBody style={{textAlign:'justify'}}>
      <b>Correlation</b> is a statistical measure which determines 
      co-relationship or association of two variables, using the 
      <b> correlation coefficient</b>, which indicates the extent to which two 
      variables move together.<br/>
      <b>Regression</b> describes how an independent variable is numerically related 
      to the dependent variable. It indicates the impact of a unit change in the known 
      variable (x) on the estimated variable (y).<br/>
      Use the input fields below to insert the data manually or import a 
      <b> .csv </b> file and calculate the results, use <a href="#">this</a> as an example file.
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={this.toggleModalHelp}>
          Close
          </Button>
      </ModalFooter>
    </Modal>)
    return (
      <>
        <div className="content">
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>Correlation and Regression<span>&nbsp;&nbsp;</span>

                <Button
                    className="btn-round btn-icon animation-on-hover"
                    color="info"
                    onClick={this.toggleModalHelp}
                    style={{ height: '20px', width: '15px' }}
                  >?
                  </Button>
                  {ModalHelp}
                  </CardHeader>
                <CardBody>
                  <Card>
                    <Container >
                      <br />
                      {
                        this.state.message !== '' ? (
                          <Alert
                            isOpen={this.state.visible}
                            toggle={this.onDismiss}
                            color={this.colorAlert} className="text-center">{this.state.message}</Alert>
                        ) : ''}
                      <br />
                      <Row>
                        <Col sm>
                          <CardTitle>Name of the independent variable(X<sub>i</sub>):</CardTitle>
                          <Input
                            type="text"
                            name="VarX"
                            value={this.state.VarX}
                            placeholder="Xi name"
                            onChange={this.handleChange}
                          /><br />
                          <CardTitle>X<sub>i</sub> - {this.state.VarX}:</CardTitle>

                          {!this.state.dispcsv ? (
                            <TagInputNaN
                              tagStyle={`background: linear-gradient(to bottom right, #550300, #d32a23, #550300);`}
                              placeholder="Independent variable values"
                              tags={this.state.tagsX}
                              onTagsChanged={this.onTagsChangedX}
                            />
                          ) :
                            <ul className="list-group mt-2">
                              {tagcsvX}
                            </ul>}
                          <br /></Col>
                        <Col sm>
                          <CardTitle>Name of the dependent variable (Y<sub>i</sub>):</CardTitle>
                          <Input
                            type="text"
                            name="VarY"
                            value={this.state.VarY}
                            placeholder="Yi name"
                            onChange={this.handleChange}
                          /><br />
                          <CardTitle>Y<sub>i</sub>  - {this.state.VarY}:</CardTitle>

                          {!this.state.dispcsv ? (
                            <TagInputNaN
                              tagStyle={`background: linear-gradient(to bottom right, #550300, #d32a23, #550300);`}
                              placeholder="Independent variable values"
                              tags={this.state.tagsY}
                              onTagsChanged={this.onTagsChangedY}
                            />
                          ) :
                            <ul className="list-group mt-2">
                              {tagcsvY}
                            </ul>}

                          <br /></Col>
                      </Row>
                      <Nav style={{ justifyContent: 'center' }}>
                        <NavItem style={{ width: '220px' }}>
                          <label
                            id="csv"
                            className={
                              this.state.csv
                                ? 'has-csv'
                                : ''}>
                            <input
                              key={fileInputKey}
                              className="csv-input"
                              type="file"
                              accept=".csv"
                              ref={input => {
                                this.filesInput = input;
                              }}
                              name="file"
                              placeholder={null}
                              onChange={this.handlecsvChange}
                            /><img
                              src={csvicon}
                              alt="select file"
                              style={{ height: '30px' }} />
                            <p />
                          </label>
                          {this.state.acceptedFiles !== '' ? (
                            <ul className="list-group mt-2">
                              {
                                <Alert
                                  toggle={this.onDismissCSV}
                                  color={'success'} className="text-center">{this.state.acceptedFiles}</Alert>
                              }
                            </ul>) : ''}
                        </NavItem>
                        <NavItem ><span>&nbsp;&nbsp;</span></NavItem >
                        <NavItem >
                          <Button
                            className="btn-round btn-icon animation-on-hover"
                            style={this.state.acceptedFiles !== '' ? { top: '15px' } : { top: '7px' }}
                            color="success"
                            size="sm"
                            onClick={this.importCSV}
                            disabled={this.state.acceptedFiles !== '' ? false : true}>
                            <AddCircle color='#fff' ></AddCircle>
                          </Button>
                        </NavItem>
                      </Nav>
                      {/* <Scatter data={data} /> */}
                    </Container>
                    <Nav style={{ justifyContent: 'center' }}>
                      <NavItem >
                        <Button className="btn-round animation-on-hover" style={{ width: '100%' }} color="primary" type="button" onClick={this.inputValidation}>
                          Show Results
                        </Button>
                      </NavItem><NavItem ><span>&nbsp;&nbsp;</span></NavItem >
                      <NavItem >
                        <Button
                          className="btn-round btn-icon animation-on-hover"
                          style={{ width: '100%' }}
                          color="primary"
                          onClick={this.toggleModalDemo}
                          disabled={this.state.btnSave}>
                          <Save color='#fff' ></Save>
                        </Button>
                        <Modal isOpen={this.state.modalDemo} toggle={this.toggleModalDemo}>
                          <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">
                              Save Analysis
                            </h5>
                            <button
                              type="button"
                              className="close"
                              data-dismiss="modal"
                              aria-hidden="true"
                              onClick={this.toggleModalDemo}
                            >
                              <i className="tim-icons icon-simple-remove" />
                            </button>
                          </div>
                          <ModalBody>
                            <p>Do you wish to save the analysis?</p>
                            <Label for="error" className="control-label">Name:</Label>
                            <Input type="text" name="Name" placeholder="Analysis name"
                              autoFocus
                              onFocus={this.onFocus}
                              ref={(input) => { this.Name = input; }}
                              onInput={this.handleChange.bind(this)}
                              style={{ backgroundColor: '#1c2336', color: '#fff' }} />
                          </ModalBody>
                          <ModalFooter>
                            <Button className="btn-round animation-on-hover" color="secondary" onClick={this.toggleModalDemo}>
                              Close
                            </Button>
                            <Button className="btn-round animation-on-hover" color="primary" onClick={this.saveChanges}>
                              Save
                            </Button>
                          </ModalFooter>
                        </Modal>
                      </NavItem>
                    </Nav> <br />
                    <Collapse isOpen={this.state.collapse}>
                      <Nav style={{ justifyContent: 'center' }}>
                        <NavItem >
                          <ListGroup>
                            <ListGroupItem style={{ backgroundColor: 'transparent' }} className="justify-content-between">Linear Correlation Coefficient: <Badge pill>{this.state.correlation}</Badge></ListGroupItem>
                            <ListGroupItem style={{ backgroundColor: 'transparent' }} className="justify-content-between">
                              Equation: <Badge pill> y<sub>1</sub> ={this.state.regression.aCoef}+{this.state.regression.iPoint}x<sub>1</sub></Badge>
                            </ListGroupItem>
                          </ListGroup><br /><br />
                        </NavItem>
                      </Nav>
                    </Collapse>
                    {/* <TagInputNaN
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
                onTagsChanged={this.onTagsChangedY} /> */}
                    {/* <Collapse isOpen={this.state.collapse}>
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
                    </Collapse> */}
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