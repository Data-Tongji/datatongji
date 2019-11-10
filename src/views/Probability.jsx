import React from "react";
import { Save } from 'grommet-icons';
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
  Col,
  FormGroup,
  Input,
  Label,
  ListGroup,
  ListGroupItem,
  Nav,
  NavItem,
  NavLink,
  Modal,
  ModalBody,
  ModalFooter,
  Row,
  TabContent,
  TabPane
} from "reactstrap";
import classnames from 'classnames';

class Probability extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      collapseint: false,
      collapse: false,
      activeTab: '1',
      selectedOption: "",
      p: '',
      q: '',
      modalDemo: false,
      modalHelp: false,
      Name: '',
      message: this.props.location.state ? this.props.location.state.message : '',
      btnSave: true
    };
    this.toggle = this.toggle.bind(this);
    this.interval = this.interval.bind(this);
    this.toggleModalDemo = this.toggleModalDemo.bind(this);
    this.toggleModalHelp = this.toggleModalHelp.bind(this);
  };

  toggle(tab) {
    // if (this.state.activeTab !== tab) {
    this.setState({
      collapseint: false,
      activeTab: tab,
      collapse: false,
      selectedOption: "",
      message: '',
      prob: "",
      btnSave: true
    });
    // }
  };

  toggleModalDemo() {
    this.setState({
      modalDemo: !this.state.modalDemo
    });
  };

  handleChange = e => {
    if (e.target.name === 'Name') {
      this.setState({ [e.target.name]: (e.target.value).trim() });
    }
    else {
      var value = e.target.value;
      var t = 0;
      value = value.replace(/[^0-9,.]/g, '');
      value = value.replace(/,{1,}/g, '.');
      value = value.replace(/\.{1,}/g, '.');
      value = value.replace(/\./g, function (match) {
        t++;
        return (t >= 2) ? '' : match;
      });

      if (e.target.name === 'spn' || e.target.name === 'BMin' || e.target.name === 'Bmax') {
        value = value.replace('.', '');
        this.setState({ [e.target.name]: value });
      }
      else if (e.target.name === 'p' || e.target.name === 'q') {
        if (parseFloat(value) > 100) {
          value = 100;
        }
        else if (parseFloat(value) < 0 || value === '') {
          value = 0;
        };
        if (e.target.name === 'p') {
          this.setState({
            [e.target.name]: value,
            q: (100 - value)
          });
        }
        else if (e.target.name === 'q') {
          this.setState({
            [e.target.name]: (value),
            p: (100 - value)
          });

        }
      }
      else {
        this.setState({ [e.target.name]: value });
      }
    }
  };

  interval = e => {
    let opt = e.target.value;
    if (opt === "2") {
      this.setState(state => ({ collapseint: true }));
    }
    else {
      this.setState(state => ({ collapseint: false }));
    }
    this.setState(state => ({ selectedOption: opt }));
  }

  ResultCollapse() {
    this.SendData();
    this.setState(state => ({ collapse: !this.state.collapse }));
  }

  SendData = () => {
    var body, type, k;

    if (this.state.activeTab === '1') {
      type = 'normal';
      body = {
        "Mean": parseFloat(this.state.Mean),
        "stdDev": parseFloat(this.state.stdDev),
        "Min": parseFloat(this.state.Min),
        "Max": parseFloat(this.state.Max),
        "Opt": parseInt(this.state.selectedOption)
      };
    } else if (this.state.activeTab === '2') {
      type = 'uniform';
      body = {
        "PMin": parseFloat(this.state.PMin),
        "PMax": parseFloat(this.state.PMax),
        "Min": parseFloat(this.state.Min),
        "Max": parseFloat(this.state.Max),
        "Opt": parseInt(this.state.selectedOption)
      };

    } else if (this.state.activeTab === '3') {
      type = 'binomial';
      if (this.state.selectedOption === '2') {
        k = [parseFloat(this.state.BMin), parseFloat(this.state.BMax)];
      } else {
        k = parseFloat(this.state.BMin);
      }
      body = {
        "k": k,
        "n": parseFloat(this.state.spn),
        "p": parseFloat(this.state.p / 100),
        "q": parseFloat(this.state.q / 100),
        "Opt": parseInt(this.state.selectedOption)
      };
    }
    const requestInfo = {
      method: 'POST',
      body: JSON.stringify(body),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      }),
    };
    fetch(`https://datatongji-backend.herokuapp.com/probability/${type}`, requestInfo)
      .then(response => {
        if (response.ok) {
          this.setState({ message: '' });
          return response.json();
        }
        throw new Error("Failure!");
      }).then(result => {
        this.setState({ btnSave: false });
        if (this.state.activeTab === '1') {
          this.setState({ prob: result.distribution })
        } else if (this.state.activeTab === '2') {
          this.setState({
            prob: result.distribution.prob,
            Mean: result.distribution.Mean,
            variance: result.distribution.variance,
            stdDev: result.distribution.stdDev,
            sdCoef: result.distribution.sdCoef
          });
        } else if (this.state.activeTab === '3') {
          this.setState({
            prob: result.distribution.prob,
            Mean: result.distribution.Mean,
            variance: result.distribution.variance,
            stdDev: result.distribution.stdDev
          });
        }
      })
      .catch(e => {
        this.setState({
          message: e.message,
          btnSave: true
        });
      });
  };

  saveChanges = () => {
    if (this.state.Name === '') {
      this.Name.focus();
    }
    else {
      this.setState({ visible: true });
      var body, k;
      if (this.state.activeTab === '1') {
        body = {
          "name": this.state.Name,
          "type": "Normal",
          "data": {
            "Mean": parseFloat(this.state.Mean),
            "stdDev": parseFloat(this.state.stdDev),
            "Min": parseFloat(this.state.Min),
            "Max": parseFloat(this.state.Max),
            "Opt": parseInt(this.state.selectedOption)
          },
          "results": {
            "prob": this.state.prob
          }
        };
      } else if (this.state.activeTab === '2') {
        body = {
          "name": this.state.Name,
          "type": "Uniform",
          "data": {
            "PMin": parseFloat(this.state.PMin),
            "PMax": parseFloat(this.state.PMax),
            "Min": parseFloat(this.state.Min),
            "Max": parseFloat(this.state.Max),
            "Opt": parseInt(this.state.selectedOption)
          },
          "results": {
            "prob": this.state.prob,
            "Mean": this.state.Mean,
            "variance": this.state.variance,
            "stdDev": this.state.stdDev,
            "sdCoef": this.state.sdCoef
          }
        };
      } else if (this.state.activeTab === '3') {
        if (this.state.selectedOption === '2') {
          k = [parseFloat(this.state.BMin), parseFloat(this.state.BMax)];
        } else {
          k = parseFloat(this.state.BMin);
        };
        body = {
          "name": this.state.Name,
          "type": "Binomial",
          "data": {
            "k": k,
            "n": parseFloat(this.state.spn),
            "p": parseFloat(this.state.p / 100),
            "q": parseFloat(this.state.q / 100),
            "Opt": parseInt(this.state.selectedOption)
          },
          "results": {
            "prob": this.state.prob,
            "Mean": this.state.Mean,
            "variance": this.state.variance,
            "stdDev": this.state.stdDev
          }
        };
      };
      const requestInfo = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: new Headers({
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        }),
      };
      fetch(`https://datatongji-backend.herokuapp.com/probability/save`, requestInfo)
        .then(response => {
          if (response.ok) {
            this.setState({ message: '' });
            return response.json();
          }
          throw new Error("Failure!");
        }).then(result => {
          this.colorAlert = 'success';
          this.setState({ message: 'Saved' });
          this.toggleModalDemo();
        })
        .catch(e => {
          this.colorAlert = 'danger';
          this.setState({ message: e.message });
        });
    }
  };

  onDismiss = () => {
    this.setState({
      visible: false,
      message: ''
    });
  };

  inputValidation = () => {
    this.colorAlert = 'danger';
    this.setState({
      visible: true,
      btnSave: true
    });
    if (this.state.activeTab === '1') {
      if (this.state.Mean == null ||
        this.state.Mean.trim() === "" ||
        parseFloat(this.state.Mean) === 0) {
        this.setState({ message: 'Invalid Mean value' });
        return false;
      }
      else if (this.state.stdDev == null ||
        this.state.stdDev.trim() === "" ||
        parseFloat(this.state.stdDev) === 0) {
        this.setState({ message: 'Invalid standard devation value' });
        return false;
      }
      else if (this.state.selectedOption === "") {
        this.setState({ message: 'Select an interval type' });
        return false;
      }
      else if (this.state.Min == null ||
        this.state.Min.trim() === "" ||
        parseFloat(this.state.Min) === 0) {
        this.setState({ message: 'Invalid minimum point value' });
        return false;
      }
      else if (this.state.collapseint === true) {
        if (this.state.Max == null ||
          this.state.Max.trim() === "" ||
          parseFloat(this.state.Max) === 0) {
          this.setState({ message: 'Invalid maximum point value' });
          return false;
        }
        else if (parseFloat(this.state.Max) < this.state.Min) {
          this.setState({ message: 'Maximum point must be higher than minimum point' });
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
      }
      else {
        this.setState({ message: '' });
        if (!this.state.collapse) {
          this.ResultCollapse();
        } else {
          this.SendData();
        }
      }
    }
    else if (this.state.activeTab === '2') {
      if (this.state.PMin == null ||
        this.state.PMin.trim() === "" ||
        parseFloat(this.state.PMin) === 0) {
        this.setState({ message: 'Invalid initial value' });
        return false;
      }
      else if (this.state.PMax == null ||
        this.state.PMax.trim() === "" ||
        parseFloat(this.state.PMax) === 0) {
        this.setState({ message: 'Invalid final value' });
        return false;
      }
      else if (parseFloat(this.state.PMax) < parseFloat(this.state.PMin)) {
        this.setState({ message: 'Final value must be higher than initial value' });
        return false;
      }
      else if (this.state.selectedOption === "") {
        this.setState({ message: 'Select an interval type' });
        return false;
      }
      else if (this.state.Min == null ||
        this.state.Min.trim() === "" ||
        parseFloat(this.state.Min) === 0) {
        this.setState({ message: 'Invalid minimum point value' });
        return false;
      }
      else if (this.state.collapseint === true) {
        if (this.state.Max == null ||
          this.state.Max.trim() === "" ||
          parseFloat(this.state.Max) === 0) {
          this.setState({ message: 'Invalid maximum point value' });
          return false;
        }
        else if (parseFloat(this.state.Max) < this.state.Min) {
          this.setState({ message: 'Maximum point must be higher than minimum point' });
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
      }
      else {
        this.setState({ message: '' });
        if (!this.state.collapse) {
          this.ResultCollapse();
        } else {
          this.SendData();
        }
      }
    }
    else if (this.state.activeTab === '3') {
      if (this.state.spn == null ||
        this.state.spn.trim() === "" ||
        parseFloat(this.state.spn) === 0) {
        this.setState({ message: 'Invalid sample size (n) value' });
        return false;
      }
      else if (this.state.p == null ||
        this.state.p === "") {
        this.setState({ message: 'Invalid success (p) value' });
        return false;
      }
      else if (this.state.q == null ||
        this.state.q === "") {
        this.setState({ message: 'Invalid failure (q) value' });
        return false;
      }
      else if ((parseFloat(this.state.p) + parseFloat(this.state.q)) > 100 || (parseFloat(this.state.p) + parseFloat(this.state.q)) < 0) {
        this.setState({ message: 'The sum between failure (q) and success (p) values must be between 0% and 100%' });
        return false;
      }
      else if (this.state.selectedOption === "") {
        this.setState({ message: 'Select an interval type' });
        return false;
      }
      else if (this.state.BMin == null ||
        this.state.BMin.trim() === "" ||
        parseFloat(this.state.BMin) === 0) {
        this.setState({ message: 'Invalid minimum point value' });
        return false;
      }
      else if (this.state.collapseint === true) {
        if (this.state.BMax == null ||
          this.state.BMax.trim() === "" ||
          parseFloat(this.state.BMax) === 0) {
          this.setState({ message: 'Invalid maximum point value' });
          return false;
        }
        else if (parseFloat(this.state.BMax) < this.state.BMin) {
          this.setState({ message: 'Maximum point must be higher than minimum point' });
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
      }
      else {
        this.setState({ message: '' });
        if (!this.state.collapse) {
          this.ResultCollapse();
        } else {
          this.SendData();
        }
      }
    }
  };

  onFocus = () => {
    this.setState({
      focused: "input-group-focus"
    });
  };

  toggleModalHelp() {
    this.setState({
      modalHelp: !this.state.modalHelp
    });
  };
  
  render() {
    let colorAlert;
    let Results;
    var TableResults;
    let Position = this.state.activeTab;
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
          onClick={this.toggleModalHelp}
        >
          <i className="tim-icons icon-simple-remove" />
        </button>
      </div>
      <ModalBody style={{ textAlign: 'justify' }}>
      <b>Normal distribution</b> is a probability distribution that is symmetric about the mean, 
      showing that data near the mean are more frequent in occurrence than data far from the mean. 
      In graph form, normal distribution will appear as a bell curve. The standard normal distribution has two parameters: 
      the <b>mean</b> and the <b>standard deviation</b>.<br/>
      A <b>uniform distribution</b> it's a type of probability distribution in which all outcomes 
      are equally likely, each variable has the same probability that it will be the outcome. This distribution is defined by two parameters:
      the <b>minimum point (initial)</b> and the <b>maximum point (final)</b>.<br/>
      The <b>binomial distribution</b> summarizes the likelihood that a value will take one of two 
      independent values under a given set of parameters or assumptions. The underlying assumptions 
      of the binomial distribution are that there is only one outcome for each trial, 
      that each trial has the same probability of success, and that each trial is mutually 
      exclusive, or independent of each other. Therefore, represents 
      the probability for <b><i>k</i> events </b> in <b><i>n</i> trials</b>, given a <b>success (<i>p</i>)</b> or <b>failure (<i>q</i>) </b> 
       probability for each trial.      
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={this.toggleModalHelp}>
          Close
          </Button>
      </ModalFooter>
    </Modal>)


    if (Position === '1') {
      TableResults =
        <ListGroup>
          <ListGroupItem style={{ backgroundColor: 'transparent' }}
            className="justify-content-between">Probability:  <Badge pill>{this.state.prob}%</Badge></ListGroupItem>
        </ListGroup>
    }
    else if (Position === '2') {
      TableResults =
        <ListGroup>
          <ListGroupItem style={{ backgroundColor: 'transparent' }}
            className="justify-content-between">Probability:  <Badge pill>{this.state.prob}%</Badge></ListGroupItem>
          <ListGroupItem style={{ backgroundColor: 'transparent' }}
            className="justify-content-between">Mean:  <Badge pill>{this.state.Mean}</Badge></ListGroupItem>
          <ListGroupItem style={{ backgroundColor: 'transparent' }}
            className="justify-content-between">Variance:  <Badge pill>{this.state.variance}</Badge></ListGroupItem>
          <ListGroupItem style={{ backgroundColor: 'transparent' }}
            className="justify-content-between">Standard Deviation:  <Badge pill>{this.state.stdDev}</Badge></ListGroupItem>
          <ListGroupItem style={{ backgroundColor: 'transparent' }}
            className="justify-content-between">Coefficient of Variation:  <Badge pill>{this.state.sdCoef}%</Badge></ListGroupItem>
        </ListGroup>
    }
    else if (Position === '3') {
      TableResults =
        <ListGroup>
          <ListGroupItem style={{ backgroundColor: 'transparent' }}
            className="justify-content-between">Probability:  <Badge pill>{this.state.prob}%</Badge></ListGroupItem>
          <ListGroupItem style={{ backgroundColor: 'transparent' }}
            className="justify-content-between">Mean:  <Badge pill>{this.state.Mean}</Badge></ListGroupItem>
          <ListGroupItem style={{ backgroundColor: 'transparent' }}
            className="justify-content-between">Variance:  <Badge pill>{this.state.variance}</Badge></ListGroupItem>
          <ListGroupItem style={{ backgroundColor: 'transparent' }}
            className="justify-content-between">Standard Deviation:  <Badge pill>{this.state.stdDev}</Badge></ListGroupItem>
        </ListGroup>
    }
    Results = <CardBody><Nav style={{ justifyContent: 'center' }}>
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
            {TableResults}
          </NavItem>
        </Nav>
      </Collapse>
    </CardBody>

    return (
      <>
        <div className="content">
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>Probability<span>&nbsp;&nbsp;</span>

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
                  <div>
                    <Nav tabs>
                      <NavItem>
                        <NavLink
                          className={classnames({ active: this.state.activeTab === '1' })}
                          onClick={() => { this.toggle('1'); }}
                        >
                          Normal
                         </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames({ active: this.state.activeTab === '2' })}
                          onClick={() => { this.toggle('2'); }}
                        >
                          Uniform
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames({ active: this.state.activeTab === '3' })}
                          onClick={() => { this.toggle('3'); }}
                        >
                          Binomial
                        </NavLink>
                      </NavItem>
                    </Nav>
                    <TabContent activeTab={this.state.activeTab}>
                      <TabPane tabId="1">
                        <Row>
                          <Col sm="12">
                            <br /><CardBody>
                              {
                                this.state.message !== '' ? (
                                  <Alert
                                    isOpen={this.state.visible}
                                    toggle={this.onDismiss}
                                    color={this.colorAlert} className="text-center">{this.state.message}</Alert>
                                ) : ''}
                              <Container >
                                <Row>
                                  <Col sm>
                                    <FormGroup inline >
                                      <CardTitle>Mean value:</CardTitle>
                                      <Input type="text"
                                        pattern="[^0-9,.]"
                                        onInput={this.handleChange.bind(this)}
                                        value={this.state.Mean}
                                        name='Mean'
                                        placeholder="0.00" />
                                      <br /><br />
                                      <CardTitle>Standard Deviation value:</CardTitle>
                                      <Input type="text"
                                        pattern="[^0-9,.]"
                                        onInput={this.handleChange.bind(this)}
                                        value={this.state.stdDev}
                                        name='stdDev'
                                        placeholder="0.00" />
                                    </FormGroup><br />
                                  </Col>
                                  <Col sm>
                                    <CardTitle>The interval between values must be</CardTitle>
                                    <FormGroup check inline className="form-check-radio" >
                                      <Label className="form-check-label">
                                        <Input type="radio" name="exampleRadios1" id="exampleRadios11" value="1"
                                          onClick={this.interval} />
                                        less than:
                                          <span className="form-check-sign"></span>
                                      </Label>
                                    </FormGroup>
                                    <FormGroup check inline className="form-check-radio">
                                      <Label className="form-check-label">
                                        <Input type="radio" name="exampleRadios1" id="exampleRadios12" value="2"
                                          onClick={this.interval} />
                                        between:
                                         <span className="form-check-sign"></span>
                                      </Label>
                                    </FormGroup>
                                    <FormGroup check inline className="form-check-radio">
                                      <Label className="form-check-label">
                                        <Input type="radio" name="exampleRadios1" id="exampleRadios13" value="3"
                                          onClick={this.interval} />
                                        higher than:
                                          <span className="form-check-sign"></span>
                                      </Label>
                                    </FormGroup><br /><br />
                                    <form>
                                      <Row>
                                        <Col sm>
                                          <Input type="text"
                                            pattern="[^0-9,.]"
                                            onInput={this.handleChange.bind(this)}
                                            value={this.state.Min}
                                            name='Min'
                                            placeholder="0.00" />
                                        </Col>
                                        <Col sm>
                                          <Collapse isOpen={this.state.collapseint}>
                                            <Input type="text"
                                              pattern="[^0-9,.]"
                                              onInput={this.handleChange.bind(this)}
                                              value={this.state.Max}
                                              name='Max'
                                              placeholder="0.00" />
                                          </Collapse>
                                        </Col>
                                      </Row>
                                    </form>
                                    <br />
                                  </Col>
                                </Row>
                              </Container>
                            </CardBody>
                          </Col>
                        </Row>
                        {Results}
                      </TabPane>
                      <TabPane tabId="2">
                        <Row>
                          <Col sm="12">
                            <br /><CardBody>
                              {this.state.message !== '' ? (
                                <Alert
                                  isOpen={this.state.visible}
                                  toggle={this.onDismiss}
                                  color={this.colorAlert} className="text-center">{this.state.message}</Alert>
                              ) : ''}
                              <Container >
                                <Row>
                                  <Col sm> <FormGroup inline >
                                    <CardTitle>Initial value:</CardTitle>
                                    <Input type="text"
                                      pattern="[^0-9,.]"
                                      onInput={this.handleChange.bind(this)}
                                      value={this.state.PMin}
                                      name='PMin'
                                      placeholder="0.00" />
                                    <br /><br />
                                    <CardTitle>Final value:</CardTitle>
                                    <Input type="text"
                                      pattern="[^0-9,.]"
                                      onInput={this.handleChange.bind(this)}
                                      value={this.state.PMax}
                                      name='PMax'
                                      placeholder="0.00" />
                                  </FormGroup><br /></Col>
                                  <Col sm><CardTitle>The interval between values must be</CardTitle>
                                    <FormGroup check inline className="form-check-radio" >
                                      <Label className="form-check-label">
                                        <Input type="radio" name="exampleRadios1" id="exampleRadios11" value="1"
                                          onClick={this.interval} />
                                        less than:
                                          <span className="form-check-sign"></span>
                                      </Label>
                                    </FormGroup>
                                    <FormGroup check inline className="form-check-radio">
                                      <Label className="form-check-label">
                                        <Input type="radio" name="exampleRadios1" id="exampleRadios12" value="2"
                                          onClick={this.interval} />
                                        between:
                                         <span className="form-check-sign"></span>
                                      </Label>
                                    </FormGroup>
                                    <FormGroup check inline className="form-check-radio">
                                      <Label className="form-check-label">
                                        <Input type="radio" name="exampleRadios1" id="exampleRadios13" value="3"
                                          onClick={this.interval} />
                                        higher than:
                                          <span className="form-check-sign"></span>
                                      </Label>
                                    </FormGroup><br /><br />
                                    <form>
                                      <Row>
                                        <Col sm>
                                          <Input type="text"
                                            pattern="[^0-9,.]"
                                            onInput={this.handleChange.bind(this)}
                                            value={this.state.Min}
                                            name='Min'
                                            placeholder="0.00" />
                                        </Col>
                                        <Col sm>
                                          <Collapse isOpen={this.state.collapseint}>
                                            <Input type="text"
                                              pattern="[^0-9,.]"
                                              onInput={this.handleChange.bind(this)}
                                              value={this.state.Max}
                                              name='Max'
                                              placeholder="0.00" />
                                          </Collapse>
                                        </Col>
                                      </Row>
                                    </form>
                                    <br /></Col>
                                </Row>
                              </Container>
                            </CardBody>
                          </Col>
                        </Row>
                        {Results}
                      </TabPane>
                      <TabPane tabId="3">
                        <Row>
                          <Col sm="12">
                            <br /><CardBody>
                              {this.state.message !== '' ? (
                                <Alert
                                  isOpen={this.state.visible}
                                  toggle={this.onDismiss}
                                  color={this.colorAlert} className="text-center">{this.state.message}</Alert>
                              ) : ''}
                              <Container >
                                <Row>
                                  <Col sm>  <FormGroup inline >
                                    <CardTitle>Sample size (<i>n</i>):</CardTitle>
                                    <Input type="text"
                                      pattern="[^0-9,.]"
                                      onInput={this.handleChange.bind(this)}
                                      value={this.state.spn}
                                      name='spn'
                                      placeholder="0" />
                                    <br /><br />
                                    <form>
                                      <Row>
                                        <Col sm>
                                          <CardTitle>Success (<i>p</i>):</CardTitle>
                                          <Input type="text"
                                            onInput={this.handleChange.bind(this)}
                                            value={this.state.p}
                                            name='p'
                                            placeholder="0.00%" /><br />
                                        </Col>
                                        <Col sm>
                                          <CardTitle>Failure (<i>q</i>):</CardTitle>
                                          <Input type="text"
                                            onInput={this.handleChange.bind(this)}
                                            value={this.state.q}
                                            name='q'
                                            placeholder="0.00%" />
                                        </Col>
                                      </Row>
                                    </form>
                                  </FormGroup><br />
                                  </Col>
                                  <Col sm>
                                    <CardTitle>The Event (<i>k</i>)  must be</CardTitle>
                                    <FormGroup check inline className="form-check-radio" >
                                      <Label className="form-check-label">
                                        <Input type="radio" name="exampleRadios1" id="exampleRadios11" value="1"
                                          onClick={this.interval} />
                                        less than:
                                          <span className="form-check-sign"></span>
                                      </Label>
                                    </FormGroup>
                                    <FormGroup check inline className="form-check-radio">
                                      <Label className="form-check-label">
                                        <Input type="radio" name="exampleRadios1" id="exampleRadios12" value="2"
                                          onClick={this.interval} />
                                        between:
                                         <span className="form-check-sign"></span>
                                      </Label>
                                    </FormGroup>
                                    <FormGroup check inline className="form-check-radio">
                                      <Label className="form-check-label">
                                        <Input type="radio" name="exampleRadios1" id="exampleRadios13" value="3"
                                          onClick={this.interval} />
                                        exactly:
                                          <span className="form-check-sign"></span>
                                      </Label>
                                    </FormGroup>
                                    <FormGroup check inline className="form-check-radio">
                                      <Label className="form-check-label">
                                        <Input type="radio" name="exampleRadios1" id="exampleRadios13" value="4"
                                          onClick={this.interval} />
                                        higher than:
                                          <span className="form-check-sign"></span>
                                      </Label>
                                    </FormGroup><br /><br />
                                    <form>
                                      <Row>
                                        <Col sm>
                                          <Input type="text"
                                            pattern="[^0-9,.]"
                                            onInput={this.handleChange.bind(this)}
                                            value={this.state.BMin}
                                            name='BMin'
                                            placeholder="0" />
                                        </Col>
                                        <Col sm>
                                          <Collapse isOpen={this.state.collapseint}>
                                            <Input type="text"
                                              pattern="[^0-9,.]"
                                              onInput={this.handleChange.bind(this)}
                                              value={this.state.BMax}
                                              name='BMax'
                                              placeholder="0" />
                                          </Collapse>
                                        </Col>
                                      </Row>
                                    </form>
                                    <br />
                                  </Col>
                                </Row>
                              </Container>
                            </CardBody>
                          </Col>
                        </Row>
                        {Results}
                      </TabPane>
                    </TabContent>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
};

export default Probability;