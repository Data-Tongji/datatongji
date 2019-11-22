import React from "react";
import { TagInputNaN } from '../components/reactjs-tag-input';
import NotificationAlert from "react-notification-alert";

import { Save, AddCircle } from 'grommet-icons';
import { Row, Col } from 'react-bootstrap';
import Papa from 'papaparse';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
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
  Input,
  Label,
  ListGroup,
  ListGroupItem,
  Modal,
  ModalBody,
  ModalFooter,
  Nav,
  NavItem,
} from "reactstrap";
import csvicon from '../assets/img/csv.svg';
import '../assets/css/csv.css';
import { DotLoader } from 'react-spinners';

var defaultMessage = localStorage.getItem('defaultLanguage') !== 'pt-br' ? require('../locales/en-us.js') : require('../locales/pt-br.js');

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
      data: [],
      line: [],
      focused: '',
      collapse: false,
      VarX: '',
      VarY: '',
      body: '',
      xProj: '',
      yProj: '',
      loading: false,
      loadingsv: false,
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
    };
    this.onTagsChangedX = this.onTagsChangedX.bind(this);
    this.onTagsChangedY = this.onTagsChangedY.bind(this);
    this.toggleModalDemo = this.toggleModalDemo.bind(this);
    this.toggleModalHelp = this.toggleModalHelp.bind(this);
    this.updateData = this.updateData.bind(this);
    this.fileInput = React.createRef();
    this.SendData = this.SendData.bind(this);
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
    if (e.target.name === 'xProj' || e.target.name === 'yProj') {
      var value = e.target.value;
      var t = 0;
      value = value.replace(/[^0-9,.]/g, '');
      value = value.replace(/,{1,}/g, '.');
      value = value.replace(/\.{1,}/g, '.');
      value = value.replace(/\./g, function (match) {
        t++;
        return (t >= 2) ? '' : match;
      });
      if (value === '') {
        value = 0;
      };
      if (e.target.name === 'xProj') {
        this.setState({
          [e.target.name]: value,
          yProj: parseFloat(this.state.regression.aCoef) + (parseFloat(this.state.regression.iPoint) * parseFloat(value))
        });
      }
      else if (e.target.name === 'yProj') {
        this.setState({
          [e.target.name]: (value),
          xProj: (parseFloat(value) - parseFloat(this.state.regression.aCoef)) / (parseFloat(this.state.regression.iPoint))
        });
      }
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
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

  async SendData() {
    this.setState({ loading: true, collapse: false });
    var tagsx = [];
    var tagsy = [];
    var data = [];

    for (var i = 0; i < this.state.tagsX.length; i++) {
      tagsx.splice(i, 0, this.state.tagsX[i].displayValue);
      tagsy.splice(i, 0, this.state.tagsY[i].displayValue);
      data.push(
        [tagsx[i],
        tagsy[i]]
      );
    };
    this.setState({
      body: {
        "X": {
          "name": this.state.VarX,
          "values": tagsx
        },
        "Y": {
          "name": this.state.VarY,
          "values": tagsy
        }
      },
      data: data
    })
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
    try {
      const response = await fetch('https://datatongji-backend.herokuapp.com/correlation/corrreg', requestInfo);
      var result = await response.json();
      if (response.ok) {
        this.setState({
          btnSave: false,
          correlation: result.distribution.correlation,
          regression: result.distribution.regression,
          line: result.distribution.line,
          collapse: true,
          loading: false
        });
      } else {
        throw new Error(result.error);
      }
    } catch (e) {
      this.notify('br', e.message, 'fas fa-exclamation-triangle', 'danger');
      this.setState({
        btnSave: true,
        loading: false,
        collapse: false
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

  inputValidation = () => {
    this.setState({
      btnSave: true
    });
    if (this.state.VarX === null || this.state.VarX.trim() === "") {
      this.notify('br', defaultMessage.Correg.x.error, 'fas fa-exclamation-triangle', 'danger');
      return false;
    }
    else if (this.state.VarY === null || this.state.VarY.trim() === "") {
      this.notify('br', defaultMessage.Correg.y.error, 'fas fa-exclamation-triangle', 'danger');
      return false;
    }
    else if (this.state.tagsX === null || this.state.tagsX.length === 0) {
      this.notify('br', defaultMessage.Correg.x.values.error, 'fas fa-exclamation-triangle', 'danger');
      return false;
    }
    else if (this.state.tagsY === null || this.state.tagsY.length === 0) {
      this.notify('br', defaultMessage.Correg.y.values.error, 'fas fa-exclamation-triangle', 'danger');
      return false;
    }
    else if (this.state.tagsY.length !== this.state.tagsX.length) {
      this.notify('br', defaultMessage.Correg.xyerror, 'fas fa-exclamation-triangle', 'danger');
      return false;
    }
    else {
      this.SendData();
    }
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
        dispcsv: false
      });
    } else {
      this.notify('br', defaultMessage.Correg.csv.error3, 'fas fa-exclamation-triangle', 'danger');
    }
  };

  importCSV = () => {
    const { csvfile } = this.state;
    Papa.parse(csvfile, {
      complete: this.updateData,
      header: true
    });
  };

  saveValidation = () => {
    if (this.state.body === '') {
      this.notify('tc', defaultMessage.Modal.save.validate, 'fas fa-exclamation-triangle', 'danger');
    }
    else if (this.state.Name === '') {
      this.Name.focus();
    }
    else {
      this.setState({
        loadingsv: true
      });
      var body = {
        "name": this.state.Name,
        "data": this.state.body,
        "results": {
          "correlation": this.state.correlation,
          "regression": this.state.regression
        },
        "language": localStorage.getItem('defaultLanguage'),
      };
      this.saveChanges(body);
    };
  }

  async saveChanges(body) {
    const requestInfo = {
      method: 'POST',
      body: JSON.stringify(body),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      }),
    };
    try {
      const response = await fetch('https://datatongji-backend.herokuapp.com/correlation/save', requestInfo);
      var promise = await response.json();
      if (response.ok) {
        this.notify('br', defaultMessage.Modal.save.message, 'fas fa-check', 'success');
        this.setState({
          loadingsv: false
        });
        this.toggleModalDemo();
      } else {
        throw new Error(promise.error);
      }
    } catch (e) {
      this.notify('tc', e.message, 'fas fa-exclamation-triangle', 'danger');
      this.setState({
        loading: false
      });
    }
  };

  updateData(result) {
    var data = result.data;
    var keys = Object.keys(data[0]);
    var arrfull = [];
    var pass = true;
    if (keys.length !== 2) {
      this.notify('br', defaultMessage.Correg.csv.error1, 'fas fa-exclamation-triangle', 'danger');
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
        this.notify('br', defaultMessage.Correg.csv.error2, 'fas fa-exclamation-triangle', 'danger');
      }
    };
  };

  _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } };

  render() {
    const fileInputKey = this.state.acceptedFiles.value ? '' : +new Date();
    let tagcsvX = null;
    let tagcsvY = null;
    let resultsbtn = defaultMessage.resultsBtn;
    if (this.state.loading === true) {
      resultsbtn = <DotLoader
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
    };
    let saveBtn = defaultMessage.Modal.btn2;
    if (this.state.loadingsv === true) {
      saveBtn = <DotLoader
        css={`
                      display: block;
                      margin: 0 auto;
                      border-color: red;
                      `}
        sizeUnit={"px"}
        size={20}
        color={'#fff'}
        loading={this.state.loadingsv}
      />
    };
    let options = {
      chart: {
        type: 'scatter',
        zoomType: 'xy',
        // backgroundColor: 'transparent',
        style: {
          fontFamily: 'Dosis, sans-serif'
        }
      },
      accessibility: {
        description: `A scatter plot compares the data between ${this.state.VarX} and ${this.state.VarY}`
      },
      title: {
        style: {
          fontSize: '16px',
          fontWeight: 'bold'
        },
        text: `${defaultMessage.Correg.chart.title} (${this.state.VarX} x ${this.state.VarY})`,
        backgroundColor: '#F0F0EA',
      },
      xAxis: {
        title: {
          enabled: true,
          text: this.state.VarX
        },
        startOnTick: true,
        endOnTick: true,
        showLastLabel: true,
        gridLineWidth: 1,
        labels: {
          style: {
            fontSize: '12px'
          }
        }
      },
      yAxis: {
        title: {
          text: this.state.VarY
        },
        minorTickInterval: 'auto',
        labels: {
          style: {
            fontSize: '12px'
          }
        }
      },
      plotOptions: {
        candlestick: {
          lineColor: '#404048'
        },
        scatter: {
          marker: {
            radius: 5,
            states: {
              hover: {
                enabled: true,
                lineColor: 'rgb(100,100,100)'
              }
            }
          },
          states: {
            hover: {
              marker: {
                enabled: true
              }
            }
          },
          tooltip: {
            headerFormat: '<b>{series.name}</b><br>',
            pointFormat: '{point.x}; {point.y}'
          }
        }
      },
      series: [{
        regression: true,
        type: 'line',
        name: defaultMessage.Correg.chart.reg,
        data: this.state.line,
        marker: {
          enabled: true
        },
        states: {
          hover: {
            lineWidth: 1
          }
        },
        enableMouseTracking: false
      }, {
        type: 'scatter',
        name: `${this.state.VarX} x ${this.state.VarY}`,
        data: this.state.data,
        color: 'rgba(223, 83, 83, .5)',
        marker: {
          radius: 4
        }
      }],
      tooltip: {
        borderWidth: 0,
        backgroundColor: 'rgba(219,219,216,0.8)',
        shadow: true
      },
    };

    if (this.state.dispcsv) {
      tagcsvX =
        (
          <TagInputNaN
            tagStyle={`background: linear-gradient(to bottom right, #550300, #d32a23, #550300);`}
            placeholder={defaultMessage.Correg.x.values.title}
            tags={this.state.tagsX}
            onTagsChanged={this.onTagsChangedX}
          />)
      tagcsvY =
        (
          <TagInputNaN
            tagStyle={`background: linear-gradient(to bottom right, #550300, #d32a23, #550300);`}
            placeholder={defaultMessage.Correg.y.values.title}
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
          <b>{defaultMessage.Modal.info.title}</b>
        </h5>
        <button
          type="button"
          className="close"
          data-dismiss="modal"
          aria-hidden="true"
          onClick={this.toggleModalHelp}
        >
          <i className="tim-icons icon-simple-remove" />
        </button>
      </div>
      <ModalBody style={{ textAlign: 'justify' }}>
        <div dangerouslySetInnerHTML={{ __html: defaultMessage.Modal.info.corregText }} />
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={this.toggleModalHelp}>
          {defaultMessage.Modal.btn1}
        </Button>
      </ModalFooter>
    </Modal>)
    return (
      <>
        <div className="content">
          <div class="notranslate">
            <div className="react-notification-alert-container">
              <NotificationAlert ref="notificationAlert" />
            </div>
            <Row>
              <Col md="12">
                <Card>
                  <CardHeader>{defaultMessage.Correg.title}<span>&nbsp;&nbsp;</span>
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
                        <br />
                        <Row>
                          <Col sm>
                            <CardTitle>{defaultMessage.Correg.x.title} (X<sub>i</sub>):</CardTitle>
                            <Input
                              type="text"
                              name="VarX"
                              value={this.state.VarX}
                              placeholder={defaultMessage.Correg.x.placeholder}
                              onChange={this.handleChange}
                            /><br />
                            <CardTitle>X<sub>i</sub> - {this.state.VarX}:</CardTitle>
                            {!this.state.dispcsv ? (
                              <TagInputNaN
                                tagStyle={`background: linear-gradient(to bottom right, #550300, #d32a23, #550300);`}
                                placeholder={defaultMessage.Correg.x.values.title}
                                tags={this.state.tagsX}
                                onTagsChanged={this.onTagsChangedX}
                              />
                            ) :
                              <ul className="list-group mt-2">
                                {tagcsvX}
                              </ul>}
                            <br /></Col>
                          <Col sm>
                            <CardTitle>{defaultMessage.Correg.y.title} (Y<sub>i</sub>):</CardTitle>
                            <Input
                              type="text"
                              name="VarY"
                              value={this.state.VarY}
                              placeholder={defaultMessage.Correg.y.placeholder}
                              onChange={this.handleChange}
                            /><br />
                            <CardTitle>Y<sub>i</sub>  - {this.state.VarY}:</CardTitle>
                            {!this.state.dispcsv ? (
                              <TagInputNaN
                                tagStyle={`background: linear-gradient(to bottom right, #550300, #d32a23, #550300);`}
                                placeholder={defaultMessage.Correg.y.values.title}
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
                                {<Alert
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
                      </Container>
                      <Nav style={{ justifyContent: 'center' }}>
                        <NavItem >
                          <Button disabled={this.state.loading} className="btn-round animation-on-hover" style={{ width: '100%' }} color="primary" type="button" onClick={this.inputValidation}>
                            {resultsbtn}
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
                                <b>{defaultMessage.Modal.save.title}</b>
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
                              <p>{defaultMessage.Modal.save.text}</p>
                              <Label for="error" className="control-label">{defaultMessage.Modal.save.input1}:</Label>
                              <Input type="text" name="Name" placeholder={defaultMessage.Modal.save.lbl1}
                                autoFocus
                                onFocus={this.onFocus}
                                ref={(input) => { this.Name = input; }}
                                onInput={this.handleChange.bind(this)}
                                style={{ backgroundColor: '#1c2336', color: '#fff' }} />
                            </ModalBody>
                            <ModalFooter>
                              <Button className="btn-round animation-on-hover" color="secondary" onClick={this.toggleModalDemo}>
                                {defaultMessage.Modal.btn1}
                              </Button>
                              <Button disabled={this.state.loadingsv} className="btn-round animation-on-hover" color="primary" onClick={this.saveValidation}>
                                {saveBtn}
                              </Button>
                            </ModalFooter>
                          </Modal>
                        </NavItem>
                      </Nav> <br />
                      <Collapse isOpen={this.state.collapse}>
                        <Nav style={{ justifyContent: 'center' }}>
                          <NavItem >
                            <ListGroup>
                              <ListGroupItem style={{ backgroundColor: 'transparent' }} className="justify-content-between">{defaultMessage.Correg.results.acoef}: <Badge pill>{this.state.correlation}</Badge></ListGroupItem>
                              <ListGroupItem style={{ backgroundColor: 'transparent' }} className="justify-content-between">
                                {defaultMessage.Correg.results.eqt}: <Badge pill> y<sub>1</sub> =({this.state.regression.aCoef})+({this.state.regression.iPoint}x<sub>1</sub>)</Badge>
                              </ListGroupItem>
                              <ListGroupItem style={{ backgroundColor: 'transparent' }} className="justify-content-between">
                                <Row>
                                  <Col sm>
                                    <CardTitle><div dangerouslySetInnerHTML={{ __html: defaultMessage.Correg.results.projx }} /></CardTitle>
                                    <Input type="text"
                                      pattern="[^0-9,.]"
                                      onInput={this.handleChange.bind(this)}
                                      value={this.state.xProj}
                                      name='xProj'
                                      placeholder="0.00" />
                                  </Col>
                                  <Col sm>
                                    <CardTitle><div dangerouslySetInnerHTML={{ __html: defaultMessage.Correg.results.projy }} /></CardTitle>
                                    <Input type="text"
                                      pattern="[^0-9,.]"
                                      onInput={this.handleChange.bind(this)}
                                      value={this.state.yProj}
                                      name='yProj'
                                      placeholder="0.00" /></Col>
                                </Row>
                              </ListGroupItem>
                            </ListGroup><br />
                          </NavItem>
                        </Nav>
                        <CardBody >
                          <HighchartsReact
                            highcharts={Highcharts}
                            options={options}
                          />
                        </CardBody>
                      </Collapse>
                    </Card>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </>
    );
  }
};

export default CorrelationRegression;