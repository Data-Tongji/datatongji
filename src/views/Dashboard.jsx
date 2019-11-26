import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// react plugin used to create charts
import { Line } from "react-chartjs-2";

// reactstrap components
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  Container,
  CardText,
  Row,
  Col,
  UncontrolledTooltip
} from "reactstrap";

var defaultMessage = localStorage.getItem('defaultLanguage') !== 'pt-br' ? require('../locales/en-us.js') : require('../locales/pt-br.js');


class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bigChartData: "data1",
      color: ''
    };
  };

  componentDidMount() {
    this.setState({
      color:
        localStorage.getItem('background'),
    })
  };

  componentWillMount() {
    if (localStorage.getItem('reload') === '0') {
      localStorage.setItem('reload', '1')
      window.location.reload();
    };
  };

  setBgChartData = name => {
    this.setState({
      bigChartData: name
    });
  };

  returnColor(btn) {
    if (this.state.bigChartData === btn) {
      return '#fff';
    }
    else {
      return this.state.color === 'light' ? '#000' : '#fff';
    }
  }

  render() {
    // document.body.classList.add("white-content");
    return (
      <>
        <div className="content">
          <div class="notranslate">
            <Card className="card-user" style={{ height: '460px' }}>
              <CardText />
              <div className="author" onmousedown='return false' onselectstart='return false'>
                <div className="block block-one" />
                <div className="block block-two" />
                <div className="block block-three" />
                <div className="block block-four" />
                
                <span class="unselectable">
                  <img
                    alt="..."
                    style={{ maxWidth: '30%' }}
                    width="250px"
                    src={require("../assets/img/logo.png")}
                  /></span>
              </div>
              <CardHeader style={{ textAlign: 'center', fontSize: '34px' }}><b>{defaultMessage.Dashboard.title}!</b></CardHeader>
              <br /><CardBody style={{ textAlign: 'justify' }}>
                <span class="unselectable" style={{ textAlign: 'justify' }}>
                  {defaultMessage.Dashboard.txt1} <b>{localStorage.getItem('userName')}</b>, {defaultMessage.Dashboard.txt2 + ' '}
                </span>
              </CardBody>

              {/* <CardHeader>
                <Col sm>
                  <ButtonGroup
                    className="btn-group-toggle float-left"
                    data-toggle="buttons"
                  >
                    <Button
                      tag="label"
                      className={classNames("btn-simple", {
                        active: this.state.bigChartData === "data1"
                      })}
                      color="primary"
                      id="0"
                      size="sm"
                      onClick={() => this.setBgChartData("data1")}
                    >
                      <input
                        defaultChecked
                        className="d-none"
                        name="options"
                        type="radio"
                      />
                      <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block" >
                        <span style={{ color: `${this.returnColor('data1')}` }}>{defaultMessage.Descriptive.title}</span>
                      </span>
                      <span className="d-block d-sm-none">
                        <i className="tim-icons icon-notes" style={{ color: `${this.returnColor('data1')}` }} />
                      </span>
                    </Button>
                    <Button
                      color="primary"
                      id="1"
                      size="sm"
                      tag="label"
                      className={classNames("btn-simple", {
                        active: this.state.bigChartData === "data2"
                      })}
                      onClick={() => this.setBgChartData("data2")}
                    >
                      <input
                        className="d-none"
                        name="options"
                        type="radio"
                      />
                      <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                        <span style={{ color: `${this.returnColor('data2')}` }}>{defaultMessage.Probability.title}</span>
                      </span>
                      <span className="d-block d-sm-none">
                        <i className="tim-icons icon-chart-bar-32" style={{ color: `${this.returnColor('data2')}` }} />
                      </span>
                    </Button>
                    <Button
                      color="primary"
                      id="2"
                      size="sm"
                      tag="label"
                      className={classNames("btn-simple", {
                        active: this.state.bigChartData === "data3"
                      })}
                      onClick={() => this.setBgChartData("data3")}
                    >
                      <input
                        className="d-none"
                        name="options"
                        type="radio"
                      />
                      <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                        <span style={{ color: `${this.returnColor('data3')}` }}>{defaultMessage.Correg.title}</span>
                      </span>
                      <span className="d-block d-sm-none">
                        <i className="tim-icons icon-vector" style={{ color: `${this.returnColor('data3')}` }} />
                      </span>
                    </Button>
                  </ButtonGroup>
                </Col><Col sm>
                  <UncontrolledDropdown>
                    <DropdownToggle
                      caret
                      className="btn-icon"
                      color="link"
                      data-toggle="dropdown"
                      type="button"
                    >
                      <i className="tim-icons icon-settings-gear-63" />
                    </DropdownToggle>
                    <DropdownMenu aria-labelledby="dropdownMenuLink" right>
                      <DropdownItem
                        href="#pablo"
                        onClick={e => e.preventDefault()}
                      >
                        Action
                      </DropdownItem>
                      <DropdownItem
                        href="#pablo"
                        onClick={e => e.preventDefault()}
                      >
                        Another action
                      </DropdownItem>
                      <DropdownItem
                        href="#pablo"
                        onClick={e => e.preventDefault()}
                      >
                        Something else
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown></Col>

              </CardHeader> */}
              {/* <CardBody>
                <div className="table-full-width table-responsive">
                  <Table>
                    <tbody>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input defaultValue="" type="checkbox" />
                              <span className="form-check-sign">
                                <span className="check" />
                              </span>
                            </Label>
                          </FormGroup>
                        </td>
                        <td>
                          <p className="title">Update the Documentation</p>
                          <p className="text-muted">
                            Dwuamish Head, Seattle, WA 8:47 AM
                            </p>
                        </td>
                        <td className="td-actions text-right">
                          <Button
                            color="link"
                            id="tooltip636901683"
                            title=""
                            type="button"
                          >
                            <i className="tim-icons icon-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip636901683"
                            placement="right"
                          >
                            Edit Task
                            </UncontrolledTooltip>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input
                                defaultChecked
                                defaultValue=""
                                type="checkbox"
                              />
                              <span className="form-check-sign">
                                <span className="check" />
                              </span>
                            </Label>
                          </FormGroup>
                        </td>
                        <td>
                          <p className="title">GDPR Compliance</p>
                          <p className="text-muted">
                            The GDPR is a regulation that requires businesses
                            to protect the personal data and privacy of Europe
                            citizens for transactions that occur within EU
                            member states.
                            </p>
                        </td>
                        <td className="td-actions text-right">
                          <Button
                            color="link"
                            id="tooltip457194718"
                            title=""
                            type="button"
                          >
                            <i className="tim-icons icon-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip457194718"
                            placement="right"
                          >
                            Edit Task
                            </UncontrolledTooltip>
                        </td>
                      </tr>                             
                    </tbody>
                  </Table>
                </div>
              </CardBody> */}
            </Card>
          </div>
        </div>
      </>
    );
  }
}

export default Dashboard;
