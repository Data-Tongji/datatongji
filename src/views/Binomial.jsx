import React from "react";
import { MDBRow, MDBCol } from 'mdbreact';
import { Normal, Uniforme } from './Calculate/Probabilities.js'
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

class Binomial extends React.Component {
  state = {
    Media: '',
    DesvP: '',
    Min: '',
    Max: '',
  };

  constructor(props) {
    super(props);
    this.state = {      
      message: this.props.location.state ? this.props.location.state.message : '',
      collapseint: false,
      collapse: false,
      activeTab: '1',
      selectedOption: "",
      tagsK: []
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
    if (this.state.activeTab === '2') {


    }

  };

  render() {
    return (
      <>
        <div className="content">
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
        </div>
      </>
    );
  }
};

export default Binomial;