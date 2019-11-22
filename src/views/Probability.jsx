
import React from "react";
import { Save } from 'grommet-icons';
import { FormControl, FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import NotificationAlert from "react-notification-alert";

import {
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
import { DotLoader } from 'react-spinners';
const useStyles = makeStyles({
  root: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  icon: {
    marginTop: '-10px',
    borderRadius: '50%',
    width: 16,
    height: 16,
    boxShadow: 'inset 0 0 0 1px 	rgb(128,128,128), inset 0 -1px 0 	rgb(128,128,128,.2)',
    backgroundColor: 'transparent',
    backgroundImage: 'transparent',
    '$root.Mui-focusVisible &': {
      outline: '2px auto rgba(211, 42, 35)',
      outlineOffset: 2,
    },
    'input:hover ~ &': {
      boxShadow: 'inset 0 0 0 1px 	rgb(85, 3, 0), inset 0 -1px 0 	rgb(85, 3, 0,.5)',
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)',
    },
  },
  checkedIcon: {
    backgroundColor: 'linear-gradient(to bottom right, #550300, #d32a23, #550300)',
    boxShadow: 'inset 0 0 0 1px 	rgb(85, 3, 0), inset 0 -1px 0 	rgb(85, 3, 0,.5)',
    backgroundImage: 'linear-gradient(to bottom right, #550300, #d32a23, #550300)',//'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    '&:before': {
      display: 'block',
      width: 16,
      height: 16,
      backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
      content: '""',
    },
    'input:hover ~ &': {
      backgroundColor: '#d32a23',
    },
  },
});

function StyledRadio(props) {
  const classes = useStyles();
  return (
    <Radio
      className={classes.root}
      disableRipple
      color="default"
      checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
      icon={<span className={classes.icon} />}
      {...props}
    />
  );
};

var defaultMessage = localStorage.getItem('defaultLanguage') !== 'pt-br' ? require('../locales/en-us.js') : require('../locales/pt-br.js');

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
      btnSave: true
    };
    this.toggle = this.toggle.bind(this);
    this.interval = this.interval.bind(this);
    this.toggleModalDemo = this.toggleModalDemo.bind(this);
    this.toggleModalHelp = this.toggleModalHelp.bind(this);
  };

  toggle(tab) {
    this.setState({
      collapseint: false,
      activeTab: tab,
      collapse: false,
      selectedOption: "",
      prob: "",
      btnSave: true,
      loading: false,
      loadingsv: false,
      Mean: '',
      stdDev: '',
      Min: '',
      Max: '',
      PMin: '',
      PMax: '',
      BMin: '',
      spn: '',
      p: '',
      q: ''
    });
    this.SendData = this.SendData.bind(this);
  };

  toggleModalDemo() {
    this.setState({
      modalDemo: !this.state.modalDemo
    });
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

      if (e.target.name === 'spn' || e.target.name === 'BMin' || e.target.name === 'BMax') {
        value = value.replace('.', '');
        this.setState({ [e.target.name]: value });
      }
      else if (e.target.name === 'p' || e.target.name === 'q') {
        if (parseFloat(value) > 100) {
          value = 100;
        }
        else if (parseFloat(value) < 0 || value === '') {
          value = 0;
        }
        else if (isNaN(value)) {
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

  async SendData() {
    this.setState({
      loading: true,
      collapse: false
    });
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
      k = parseInt(this.state.selectedOption) === 2 ? [parseFloat(this.state.BMin), parseFloat(this.state.BMax)] : parseFloat(this.state.BMin);
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

    try {
      const response = await fetch(`https://datatongji-backend.herokuapp.com/probability/${type}`, requestInfo)
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

  saveValidation = () => {
    this.setState({ loadingsv: true });
    if (this.state.Name === '') {
      this.Name.focus();
    }
    else {
      var body, k;
      this.setState({ visible: true });
      if (this.state.activeTab === '1') {
        body = {
          "name": this.state.Name,
          "type": defaultMessage.Probability.Normal.title,
          "language": localStorage.getItem('defaultLanguage'),
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
          "type": defaultMessage.Probability.Uniform.title,
          "language": localStorage.getItem('defaultLanguage'),
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
        k = parseInt(this.state.selectedOption) === 2 ? [parseFloat(this.state.BMin), parseFloat(this.state.BMax)] : parseFloat(this.state.BMin);
        body = {
          "name": this.state.Name,
          "type": defaultMessage.Probability.Binomial.title,
          "language": localStorage.getItem('defaultLanguage'),
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
      this.saveChanges(body)
    }
  };

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
      const response = await fetch('https://datatongji-backend.herokuapp.com/probability/save', requestInfo);
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
      this.notify('br', e.message, 'fas fa-exclamation-triangle', 'danger');
      this.setState({
        loading: false
      });
    }
  };

  inputValidation = () => {
    this.setState({
      btnSave: true,
      collapse: false
    });
    if (this.state.activeTab === '1') {
      if (this.state.Mean == null ||
        this.state.Mean.trim() === "" ||
        parseFloat(this.state.Mean) === 0) {
        this.notify('br', defaultMessage.Probability.Normal.mean.error, 'fas fa-exclamation-triangle', 'danger');
        return false;
      }
      else if (this.state.stdDev == null ||
        this.state.stdDev.trim() === "" ||
        parseFloat(this.state.stdDev) === 0) {
        this.notify('br', defaultMessage.Probability.Normal.std.error, 'fas fa-exclamation-triangle', 'danger');
        return false;
      }
      else if (this.state.selectedOption === "") {
        this.notify('br', defaultMessage.Probability.interval.error1, 'fas fa-exclamation-triangle', 'danger');
        return false;
      }
      else if (this.state.Min == null ||
        this.state.Min.trim() === "" ||
        parseFloat(this.state.Min) === 0) {
        this.notify('br', defaultMessage.Probability.interval.erroroptmin, 'fas fa-exclamation-triangle', 'danger');
        return false;
      }
      else if (this.state.collapseint === true) {
        if (this.state.Max == null ||
          this.state.Max.trim() === "" ||
          parseFloat(this.state.Max) === 0) {
          this.notify('br', defaultMessage.Probability.interval.erroroptmax, 'fas fa-exclamation-triangle', 'danger');
          return false;
        }
        else if (parseFloat(this.state.Max) < this.state.Min) {
          this.notify('br', defaultMessage.Probability.interval.error2, 'fas fa-exclamation-triangle', 'danger');
          return false;
        }
        else {
          this.SendData();
        }
      }
      else {
        this.SendData();
      }
    }
    else if (this.state.activeTab === '2') {
      if (this.state.PMin == null ||
        this.state.PMin.trim() === "" ||
        parseFloat(this.state.PMin) === 0) {
        this.notify('br', defaultMessage.Probability.Uniform.initial.error, 'fas fa-exclamation-triangle', 'danger');
        return false;
      }
      else if (this.state.PMax == null ||
        this.state.PMax.trim() === "" ||
        parseFloat(this.state.PMax) === 0) {
        this.notify('br', defaultMessage.Probability.Uniform.final.error, 'fas fa-exclamation-triangle', 'danger');
        return false;
      }
      else if (parseFloat(this.state.PMax) < parseFloat(this.state.PMin)) {
        this.notify('br', defaultMessage.Probability.Uniform.error1, 'fas fa-exclamation-triangle', 'danger');
        return false;
      }
      else if (this.state.selectedOption === "") {
        this.notify('br', defaultMessage.Probability.interval.error1, 'fas fa-exclamation-triangle', 'danger');
        return false;
      }
      else if (this.state.Min == null ||
        this.state.Min.trim() === "" ||
        parseFloat(this.state.Min) === 0) {
        this.notify('br', defaultMessage.Probability.interval.erroroptmin, 'fas fa-exclamation-triangle', 'danger');
        return false;
      }
      else if (this.state.collapseint === true) {
        if (this.state.Max == null ||
          this.state.Max.trim() === "" ||
          parseFloat(this.state.Max) === 0) {
          this.notify('br', defaultMessage.Probability.interval.erroroptmax, 'fas fa-exclamation-triangle', 'danger');
          return false;
        }
        else if (parseFloat(this.state.Max) < this.state.Min) {
          this.notify('br', defaultMessage.Probability.interval.error2, 'fas fa-exclamation-triangle', 'danger');
          return false;
        }
        else {
          this.SendData();
        }
      }
      else {
        this.SendData();
      }
    }
    else if (this.state.activeTab === '3') {
      if (this.state.spn == null ||
        this.state.spn.trim() === "" ||
        parseFloat(this.state.spn) === 0) {
        this.notify('br', defaultMessage.Probability.Binomial.sample.error, 'fas fa-exclamation-triangle', 'danger');
        return false;
      }
      else if (this.state.p == null ||
        this.state.p === "") {
        this.notify('br', defaultMessage.Probability.Binomial.p.error, 'fas fa-exclamation-triangle', 'danger');
        return false;
      }
      else if (this.state.q == null ||
        this.state.q === "") {
        this.notify('br', defaultMessage.Probability.Binomial.q.error, 'fas fa-exclamation-triangle', 'danger');
        return false;
      }
      else if (this.state.selectedOption === "") {
        this.notify('br', defaultMessage.Probability.interval.error1, 'fas fa-exclamation-triangle', 'danger');
        return false;
      }
      else if (this.state.BMin == null ||
        this.state.BMin.trim() === "") {
        this.notify('br', defaultMessage.Probability.Binomial.event.error1, 'fas fa-exclamation-triangle', 'danger');
        return false;
      }
      else if (parseFloat(this.state.selectedOption) !== 1 &&
        (parseFloat(this.state.BMin) > parseFloat(this.state.spn))
      ) {
        this.notify('br', defaultMessage.Probability.Binomial.event.error2, 'fas fa-exclamation-triangle', 'danger');
        return false;
      }
      else if (this.state.collapseint === true) {
        if (this.state.BMax == null ||
          this.state.BMax.trim() === "") {
          this.notify('br', defaultMessage.Probability.Binomial.event.error1, 'fas fa-exclamation-triangle', 'danger');
          return false;
        }
        else if (parseFloat(this.state.BMax) < this.state.BMin) {
          this.notify('br', defaultMessage.Probability.Binomial.event.error3, 'fas fa-exclamation-triangle', 'danger');
          return false;
        }
        else if (parseFloat(this.state.selectedOption) !== 1 &&
          (parseFloat(this.state.BMin) > parseFloat(this.state.spn) ||
            parseFloat(this.state.BMax) > parseFloat(this.state.spn))
        ) {
          this.notify('br', defaultMessage.Probability.Binomial.event.error2, 'fas fa-exclamation-triangle', 'danger');
          return false;
        }
        else {
          this.SendData();
        }
      }
      else {
        this.SendData();
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
    var TableResults;
    let Position = this.state.activeTab;
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
        <div dangerouslySetInnerHTML={{ __html: defaultMessage.Modal.info.probabilityText }} />
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={this.toggleModalHelp}>
          {defaultMessage.Modal.btn1}
        </Button>
      </ModalFooter>
    </Modal>)
    let intervaltag = <CardBody>
      <FormControl component="fieldset">
        <RadioGroup aria-label="position" name="position" value={this.state.selectedOption} onChange={this.interval} row>
          <FormControlLabel
            value="1"
            control={<StyledRadio />}
            label={<CardTitle style={{}}>{defaultMessage.Probability.interval.opt1}: </CardTitle>}
            labelPlacement="end" />
          <FormControlLabel
            value="2"
            control={<StyledRadio />}
            label={<CardTitle style={{}}>{defaultMessage.Probability.interval.opt2}: </CardTitle>}
            labelPlacement="end" />
          <FormControlLabel
            value="3"
            control={<StyledRadio />}
            label={<CardTitle style={{}}>{defaultMessage.Probability.interval.opt4}: </CardTitle>}
            labelPlacement="end" />
        </RadioGroup>
      </FormControl>
      <form>
        <Row>
          <Col sm>
            <Input type="text"
              pattern="[^0-9,.]"
              onInput={this.handleChange.bind(this)}
              value={this.state.Min}
              name='Min'
              placeholder="0.00" />
          </Col><br /><br />
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
      </form></CardBody>;

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

    if (Position === '1') {
      TableResults =
        <ListGroup>
          <ListGroupItem style={{ backgroundColor: 'transparent' }}
            className="justify-content-between">{defaultMessage.Probability.title}:  <Badge pill>{this.state.prob}%</Badge></ListGroupItem>
        </ListGroup>
    }
    else if (Position === '2') {
      TableResults =
        <ListGroup>
          <ListGroupItem style={{ backgroundColor: 'transparent' }}
            className="justify-content-between">{defaultMessage.Probability.title}:  <Badge pill>{this.state.prob}%</Badge></ListGroupItem>
          <ListGroupItem style={{ backgroundColor: 'transparent' }}
            className="justify-content-between">{defaultMessage.Probability.Results.mean}:  <Badge pill>{this.state.Mean}</Badge></ListGroupItem>
          <ListGroupItem style={{ backgroundColor: 'transparent' }}
            className="justify-content-between">{defaultMessage.Probability.Results.var}:  <Badge pill>{this.state.variance}</Badge></ListGroupItem>
          <ListGroupItem style={{ backgroundColor: 'transparent' }}
            className="justify-content-between">{defaultMessage.Probability.Results.std}:  <Badge pill>{this.state.stdDev}</Badge></ListGroupItem>
          <ListGroupItem style={{ backgroundColor: 'transparent' }}
            className="justify-content-between">{defaultMessage.Probability.Results.coef}:  <Badge pill>{this.state.sdCoef}%</Badge></ListGroupItem>
        </ListGroup>
    }
    else if (Position === '3') {
      TableResults =
        <ListGroup>
          <ListGroupItem style={{ backgroundColor: 'transparent' }}
            className="justify-content-between">{defaultMessage.Probability.title}:  <Badge pill>{this.state.prob}%</Badge></ListGroupItem>
          <ListGroupItem style={{ backgroundColor: 'transparent' }}
            className="justify-content-between">{defaultMessage.Probability.Results.mean}:  <Badge pill>{this.state.Mean}</Badge></ListGroupItem>
          <ListGroupItem style={{ backgroundColor: 'transparent' }}
            className="justify-content-between">{defaultMessage.Probability.Results.var}:  <Badge pill>{this.state.variance}</Badge></ListGroupItem>
          <ListGroupItem style={{ backgroundColor: 'transparent' }}
            className="justify-content-between">{defaultMessage.Probability.Results.std}:  <Badge pill>{this.state.stdDev}</Badge></ListGroupItem>
        </ListGroup>
      intervaltag = <CardBody>
        <FormControl component="fieldset">
          <RadioGroup aria-label="position" name="position" value={this.state.selectedOption} onChange={this.interval} row>
            <FormControlLabel
              value="1"
              control={<StyledRadio />}
              label={<CardTitle style={{}}>{defaultMessage.Probability.interval.opt1}: </CardTitle>}
              labelPlacement="end" />
            <FormControlLabel
              value="2"
              control={<StyledRadio />}
              label={<CardTitle style={{}}>{defaultMessage.Probability.interval.opt2}: </CardTitle>}
              labelPlacement="end" />
            <FormControlLabel
              value="3"
              control={<StyledRadio />}
              label={<CardTitle style={{}}>{defaultMessage.Probability.interval.opt3}: </CardTitle>}
              labelPlacement="end" />
            <FormControlLabel
              value="4"
              control={<StyledRadio />}
              label={<CardTitle style={{}}>{defaultMessage.Probability.interval.opt4}: </CardTitle>}
              labelPlacement="end" />
          </RadioGroup>
        </FormControl>
        <form>
          <Row>
            <Col sm>
              <Input type="text"
                pattern="[^0-9,.]"
                onInput={this.handleChange.bind(this)}
                value={this.state.BMin}
                name='BMin'
                placeholder="0" />
            </Col><br /><br />
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
      </CardBody>
    }
    let Results = <CardBody><Nav style={{ justifyContent: 'center' }}>
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
            {TableResults}
          </NavItem>
        </Nav>
      </Collapse>
    </CardBody>

    return (
      <>
        <div className="content">
          <div class="notranslate">
            <Row>
              <div className="react-notification-alert-container">
                <NotificationAlert ref="notificationAlert" />
              </div>
              <Col md="12">
                <Card>
                  <CardHeader>{defaultMessage.Probability.title}<span>&nbsp;&nbsp;</span>
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
                            {defaultMessage.Probability.Normal.title}
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={classnames({ active: this.state.activeTab === '2' })}
                            onClick={() => { this.toggle('2'); }}
                          >
                            {defaultMessage.Probability.Uniform.title}
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={classnames({ active: this.state.activeTab === '3' })}
                            onClick={() => { this.toggle('3'); }}
                          >
                            {defaultMessage.Probability.Binomial.title}
                          </NavLink>
                        </NavItem>
                      </Nav>
                      <TabContent activeTab={this.state.activeTab}><br />
                        <TabPane tabId="1">
                          <Row>
                            <Col sm="12">
                              <CardBody>
                                <Container >
                                  <Row>
                                    <Col sm>
                                      <FormGroup inline >
                                        <CardTitle>{defaultMessage.Probability.Normal.mean.title}:</CardTitle>
                                        <Input type="text"
                                          pattern="[^0-9,.]"
                                          onInput={this.handleChange.bind(this)}
                                          value={this.state.Mean}
                                          name='Mean'
                                          placeholder="0.00" />
                                        <br /><br />
                                        <CardTitle>{defaultMessage.Probability.Normal.std.title}:</CardTitle>
                                        <Input type="text"
                                          pattern="[^0-9,.]"
                                          onInput={this.handleChange.bind(this)}
                                          value={this.state.stdDev}
                                          name='stdDev'
                                          placeholder="0.00" />
                                      </FormGroup><br />
                                    </Col>
                                    <Col sm>
                                      <CardTitle>{defaultMessage.Probability.interval.title}</CardTitle>
                                      {intervaltag}
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
                              <CardBody>
                                <Container >
                                  <Row>
                                    <Col sm> <FormGroup inline >
                                      <CardTitle>{defaultMessage.Probability.Uniform.initial.title}:</CardTitle>
                                      <Input type="text"
                                        pattern="[^0-9,.]"
                                        onInput={this.handleChange.bind(this)}
                                        value={this.state.PMin}
                                        name='PMin'
                                        placeholder="0.00" />
                                      <br /><br />
                                      <CardTitle>{defaultMessage.Probability.Uniform.final.title}:</CardTitle>
                                      <Input type="text"
                                        pattern="[^0-9,.]"
                                        onInput={this.handleChange.bind(this)}
                                        value={this.state.PMax}
                                        name='PMax'
                                        placeholder="0.00" />
                                    </FormGroup><br /></Col>
                                    <Col sm><CardTitle>{defaultMessage.Probability.interval.title}</CardTitle>
                                      {intervaltag}
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
                              <CardBody>
                                <Container >
                                  <Row>
                                    <Col sm="5">  <FormGroup inline >
                                      <CardTitle>{defaultMessage.Probability.Binomial.sample.title}:</CardTitle>
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
                                            <CardTitle>{defaultMessage.Probability.Binomial.p.title}:</CardTitle>
                                            <Input type="text"
                                              onInput={this.handleChange.bind(this)}
                                              value={this.state.p}
                                              name='p'
                                              placeholder="0.00%" /><br />
                                          </Col>
                                          <Col sm>
                                            <CardTitle>{defaultMessage.Probability.Binomial.q.title}:</CardTitle>
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
                                      <CardTitle>{defaultMessage.Probability.Binomial.event.title}</CardTitle>
                                      {intervaltag}
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
        </div>
      </>
    );
  }
};

export default Probability;