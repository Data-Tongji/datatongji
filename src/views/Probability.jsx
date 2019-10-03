import React from "react";
import { MDBRow, MDBCol } from 'mdbreact';
import { Normal, Uniforme } from './Calculate/Probabilities.js'
import { Binomial } from './Binomial'
import { TagInputNaN } from '../components/reactjs-tag-input'
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardText,
  CardTitle,
  Collapse,
  Container,
  Col,
  FormGroup,
  Input,
  Label,
  Nav,
  NavItem,
  NavLink,
  Row,
  Table,
  TabContent,
  TabPane
} from "reactstrap";
import classnames from 'classnames';

class Probability extends React.Component {
  state = {
    Media: '',
    DesvP: '',
    Min: '',
    Max: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      collapseint: false,
      collapse: false,
      activeTab: '1',
      selectedOption: "",
      tagsK: [],
      message: this.props.location.state ? this.props.location.state.message : '',
    };
    this.toggle = this.toggle.bind(this);
    this.intervalo = this.intervalo.bind(this);
    this.onTagsChangedK = this.onTagsChangedK.bind(this);
  };

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
        collapseint: false,
        collapse: false,
        selectedOption: ""
      });
    }
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  intervalo = e => {
    let opt = e.target.value;
    if (opt === "2") {
      this.setState(state => ({ collapseint: true }));
    }
    else {
      this.setState(state => ({ collapseint: false }));
    }
    this.setState(state => ({ selectedOption: opt }));
  }

  onTagsChangedK(tagsK) {
    this.setState({ tagsK });
  };

  ResultCollapse() {
    this.setState(state => ({ collapse: !this.state.collapse }));
  }

  Calcular = () => {
    if (this.state.activeTab === '1') {
      return Normal(parseFloat(this.state.Media), parseFloat(this.state.DesvP), parseFloat(this.state.Min), parseFloat(this.state.Max), parseInt(this.state.selectedOption));
    }
    else if (this.state.activeTab === '2') {
      return Uniforme([parseFloat(this.state.Media), parseFloat(this.state.DesvP)], parseFloat(this.state.Min), parseFloat(this.state.Max), parseInt(this.state.selectedOption));
    }

  }

  valida = () => {
    if (this.state.activeTab === '1') {
      if (this.state.Media == null ||
        this.state.Media.trim() === "" ||
        parseFloat(this.state.Media) === 0) {
        this.setState({ message: 'Valor inválido para o campo Média' });
        return false;
      }
      else if (this.state.DesvP == null ||
        this.state.DesvP.trim() === "" ||
        parseFloat(this.state.DesvP) === 0) {
        this.setState({ message: 'Valor inválido para o campo Desvio Padrão' });
        return false;
      }
      else if (this.state.selectedOption === "") {
        this.setState({ message: 'Selecione um tipo de intervalo' });
        return false;
      }
      else if (this.state.Min == null ||
        this.state.Min.trim() === "" ||
        parseFloat(this.state.Min) === 0) {
        this.setState({ message: 'Valor inválido para o ponto mínimo' });
        return false;
      }
      else if (this.state.collapseint === true) {
        if (this.state.Max == null ||
          this.state.Max.trim() === "" ||
          parseFloat(this.state.Max) === 0) {
          this.setState({ message: 'Valor inválido para o ponto máximo' });
          return false;
        }
        else {
          this.setState({ message: '' });
          this.ResultCollapse();
        }
      }
      else {
        this.setState({ message: '' });
        this.ResultCollapse();
      }
    }
    else if (this.state.activeTab === '1') {


    }

  };

  render() {
    return (
      <>
        <div className="content">
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>Probabilidade</CardHeader>
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
                          Uniforme
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames({ active: this.state.activeTab === '3' })}
                          onClick={() => { this.toggle('3'); }}
                        >
                          Binominal
                        </NavLink>
                      </NavItem>
                    </Nav>
                    <TabContent activeTab={this.state.activeTab}>
                      <TabPane tabId="1">
                        <Row>
                          <Col sm="12">
                            <br /><CardBody style={{ marginLeft: '5%', marginRight: '5%' }}>
                              {
                                this.state.message !== '' ? (
                                  <Alert color='danger' className="text-center">{this.state.message}</Alert>
                                ) : ''}
                              <Container >
                                <MDBRow className="mx-auto" >
                                  {/* style={{height:'300px'}} */}
                                  <MDBCol ><FormGroup inline >
                                    <CardTitle>Digite o valor da Média:</CardTitle>
                                    <Input type="number" step={0.01} precision={2} name="Media" onChange={this.handleChange} placeholder="0,00" />
                                    <br /><br />
                                    <CardTitle>Digite o valor do Desvio Padrão (%):</CardTitle>
                                    <Input type="number" step={0.01} precision={2} name="DesvP" onChange={this.handleChange} placeholder="0,00%" />
                                  </FormGroup><br />
                                  </MDBCol>
                                  <MDBCol >
                                    <CardTitle>O intervalo deve ser</CardTitle>
                                    <FormGroup check inline className="form-check-radio" style={{ marginLeft: '10%' }}>
                                      <Label className="form-check-label">
                                        <Input type="radio" name="exampleRadios1" id="exampleRadios11" value="1"
                                          onClick={this.intervalo} />
                                        menor que:
                                          <span className="form-check-sign"></span>
                                      </Label>
                                    </FormGroup>
                                    <FormGroup check inline className="form-check-radio">
                                      <Label className="form-check-label">
                                        <Input type="radio" name="exampleRadios1" id="exampleRadios12" value="2"
                                          onClick={this.intervalo} />
                                        entre:
                                         <span className="form-check-sign"></span>
                                      </Label>
                                    </FormGroup>
                                    <FormGroup check inline className="form-check-radio">
                                      <Label className="form-check-label">
                                        <Input type="radio" name="exampleRadios1" id="exampleRadios13" value="3"
                                          onClick={this.intervalo} />
                                        maior que:
                                          <span className="form-check-sign"></span>
                                      </Label>
                                    </FormGroup><br /><br />
                                    <form>
                                      <Row>
                                        <Col>
                                          <Input type="number" step={0.01} precision={2} name="Min" onChange={this.handleChange} placeholder="0,00" />
                                        </Col>
                                        <Col>
                                          <Collapse isOpen={this.state.collapseint}>
                                            <Input type="number" step={0.01} precision={2} name="Max" onChange={this.handleChange} placeholder="0,00" />
                                          </Collapse>
                                        </Col>
                                      </Row>
                                    </form>
                                    <br />
                                  </MDBCol>
                                </MDBRow>
                              </Container>
                            </CardBody>
                          </Col>
                        </Row>
                        <Nav style={{ justifyContent: 'center' }}>
                          <NavItem >
                            <Button style={{ width: '100%' }} color="primary" type="button" onClick={this.valida}>
                              Calcular
                            </Button>
                          </NavItem>
                        </Nav><br /><br />
                        <Collapse isOpen={this.state.collapse}>
                          <Nav style={{ justifyContent: 'center' }}>
                            <NavItem >
                              <blockquote className="blockquote">
                                <p className="mb-0">Probabilidade: {this.Calcular()} %.</p>
                              </blockquote>
                            </NavItem>
                          </Nav>
                        </Collapse>
                      </TabPane>
                      <TabPane tabId="2">
                        <Row>
                          <Col sm="12">
                            <br /><CardBody style={{ marginLeft: '5%', marginRight: '5%' }}>
                              {
                                this.state.message !== '' ? (
                                  <Alert color='danger' className="text-center">{this.state.message}</Alert>
                                ) : ''}
                              <Container >
                                <MDBRow className="mx-auto" >
                                  {/* style={{height:'300px'}} */}
                                  <MDBCol ><FormGroup inline >
                                    <CardTitle>Ponto máximo:</CardTitle>
                                    <Input type="number" step={0.01} precision={2} name="PMax" onChange={this.handleChange} placeholder="0,00" />
                                    <br /><br />
                                    <CardTitle>Ponto mínimo:</CardTitle>
                                    <Input type="number" step={0.01} precision={2} name="PMin" onChange={this.handleChange} placeholder="0,00" />
                                  </FormGroup><br />
                                  </MDBCol>
                                  <MDBCol >
                                    <CardTitle>O intervalo deve ser</CardTitle>
                                    <FormGroup check inline className="form-check-radio" style={{ marginLeft: '10%' }}>
                                      <Label className="form-check-label">
                                        <Input type="radio" name="exampleRadios1" id="exampleRadios11" value="1"
                                          onClick={this.intervalo} />
                                        menor que:
                                          <span className="form-check-sign"></span>
                                      </Label>
                                    </FormGroup>
                                    <FormGroup check inline className="form-check-radio">
                                      <Label className="form-check-label">
                                        <Input type="radio" name="exampleRadios1" id="exampleRadios12" value="2"
                                          onClick={this.intervalo} />
                                        entre:
                                         <span className="form-check-sign"></span>
                                      </Label>
                                    </FormGroup>
                                    <FormGroup check inline className="form-check-radio">
                                      <Label className="form-check-label">
                                        <Input type="radio" name="exampleRadios1" id="exampleRadios13" value="3"
                                          onClick={this.intervalo} />
                                        maior que:
                                          <span className="form-check-sign"></span>
                                      </Label>
                                    </FormGroup><br /><br />
                                    <form>
                                      <Row>
                                        <Col>
                                          <Input type="number" step={0.01} precision={2} name="Min" onChange={this.handleChange} placeholder="0,00" />
                                        </Col>
                                        <Col>
                                          <Collapse isOpen={this.state.collapseint}>
                                            <Input type="number" step={0.01} precision={2} name="Max" onChange={this.handleChange} placeholder="0,00" />
                                          </Collapse>
                                        </Col>
                                      </Row>
                                    </form>

                                    <br />

                                  </MDBCol>

                                </MDBRow>
                              </Container>

                            </CardBody>
                          </Col>
                        </Row>
                        <Nav style={{ justifyContent: 'center' }}>
                          <NavItem >
                            <Button style={{ width: '100%' }} color="primary" type="button" onClick={this.valida}>
                              Calcular
                            </Button>
                          </NavItem>
                        </Nav><br /><br />
                        <Collapse isOpen={this.state.collapse}>
                          <Nav style={{ justifyContent: 'center' }}>
                            <NavItem >
                              <blockquote className="blockquote">
                                <p className="mb-0">Probabilidade: {this.Calcular()} %.</p>
                              </blockquote>
                            </NavItem>
                          </Nav>
                        </Collapse>
                      </TabPane>
                      <TabPane tabId="3">
                        <Row>
                          <Col sm="12">
                            <br /><CardBody style={{ marginLeft: '5%', marginRight: '5%' }}>
                              {
                                this.state.message !== '' ? (
                                  <Alert color='danger' className="text-center">{this.state.message}</Alert>
                                ) : ''}
                              <Container >
                                <MDBRow className="mx-auto" >
                                  <MDBCol ><FormGroup inline >
                                    <CardTitle>Tamanho da amostra (<i>n</i>):</CardTitle>
                                    <Input type="number" step={0.01} precision={2} name="DesvP" onChange={this.handleChange} placeholder="0,00" />
                                  </FormGroup><br />
                                    <form>
                                      <Row>
                                        <Col>
                                          <CardTitle>Sucesso (<i>p</i>):</CardTitle>
                                          <Input type="number" step={0.01} precision={2} name="Min" onChange={this.handleChange} placeholder="0,00" />
                                        </Col>
                                        <Col>
                                          <CardTitle>Fracasso (<i>q</i>):</CardTitle>
                                          <Input type="number" step={0.01} precision={2} name="Max" onChange={this.handleChange} placeholder="0,00" />
                                        </Col>
                                      </Row>
                                    </form>
                                  </MDBCol>
                                  <MDBCol >
                                    <CardTitle>Evento (<i>k</i>):</CardTitle>
                                    <TagInputNaN placeholder="Valores do evento" tags={this.state.tagsK} onTagsChanged={this.onTagsChangedK} />

                                    <br />

                                  </MDBCol>

                                </MDBRow>
                              </Container>

                            </CardBody>
                          </Col>
                        </Row>
                        <Nav style={{ justifyContent: 'center' }}>
                          <NavItem >
                            <Button style={{ width: '100%' }} color="primary" type="button" onClick={this.valida}>
                              Calcular
                            </Button>
                          </NavItem>
                        </Nav><br /><br />
                        <Collapse isOpen={this.state.collapse}>
                          <Nav style={{ justifyContent: 'center' }}>
                            <NavItem >
                              <blockquote className="blockquote">
                                <p className="mb-0">Probabilidade: {this.Calcular()} %.</p>
                              </blockquote>
                            </NavItem>
                          </Nav>
                        </Collapse>
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