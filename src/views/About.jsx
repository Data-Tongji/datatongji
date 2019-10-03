import React from "react";
import { MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBRow, MDBCol } from 'mdbreact';
import { Github, Linkedin } from 'grommet-icons';
import {
  Row,
  Col,
  CardText,
  Container,
  Card,
  Nav,
  CardBody
} from "reactstrap";



export class About extends React.Component {

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

  render() {
    return (
      <>
        <Row style={{ marginRight: '3%', marginLeft: '3%', marginTop: '2%' }} >
          <Col md="12">
            <Card className="card-user">
              <CardBody >
                <CardText />
                <div className="author" onmousedown='return false' onselectstart='return false'>
                  <div className="block block-one" />
                  <div className="block block-two" />
                  <div className="block block-three" />
                  <div className="block block-four" />
                  <a href="/#/" class="unselectable">
                    <img
                      alt="..."
                      className="avatar-logo"
                      style={{ width: '30%' }}
                      src={require("assets/img/logoTong.png")}
                    />
                  </a>
                </div>
                <div className="card-description" style={{ marginLeft: '2%', marginRight: '2%', textAlign: 'justify' }}>
                  <span class="unselectable" style={{ textAlign: 'justify' }}>A criação do sistema Data Tongjìt teve o intuito de
                    facilitar o cálculo e a visualização dos resultados de análises de dados a partir de
                    perspectivas estatísticas diferentes, o que permite ainda, a integração de métodos ou dados
                    quantitativos no projeto de forma aprofundada. É possível, por exemplo, quantificar resultados
                  de análises qualitativas ou calcular frequências estatísticas de forma simples e direta.</span>
                  <p /><span class="unselectable" style={{ textAlign: 'justify' }}>A entrada de dados pode ser manual ou
                  importada através de arquivos .xlsx ou .csv, o sistema consegue entender qual a forma de análise desejada
                  quantitativa ou qualitativa. Os resultados podem ser visualizados em gráficos e tabelas, além de serem todos
                  salvos em um banco de dados para serem reaproveitados em cálculos futuros.</span>
                </div>
              </CardBody ><br /><br />
              <Container style={{ width: '70%' }}>
                <MDBRow className="mx-auto" >
                  {/* style={{height:'300px'}} */}
                  <MDBCol >
                    <MDBCard style={{ height: '65%' }} cascade>
                      <MDBCardImage cascade className="img-fluid" src={require("assets/img/Lucas.jpg")} />
                      <MDBCardBody cascade>
                        <MDBCardTitle style={{ textAlign: 'center' }}> Lucas Damas</MDBCardTitle> 
                        <Nav style={{ justifyContent: 'center', alignItems: 'center' }}>
                          <MDBBtn circle size="lg" tag="a" floating social="li" href="https://linkedin.com/in/lucas-damas-corr%C3%AAa-882806176/" target="_blank">
                            <Linkedin color='plain' />
                          </MDBBtn>
                          <MDBBtn circle size="lg" tag="a" floating social="git" href="https://github.com/lucasdcorrea1" target="_blank">
                            <Github color='brand' />
                          </MDBBtn>
                        </Nav>
                      </MDBCardBody>
                    </MDBCard>
                  </MDBCol>
                  <MDBCol>
                    <MDBCard style={{ height: '65%' }} cascade >
                      <MDBCardImage cascade className="img-fluid" src={require("assets/img/Leonardo.jpg")} />
                      <MDBCardBody cascade>
                        <MDBCardTitle style={{ textAlign: 'center' }}> Leonardo Ronne</MDBCardTitle>
                        <Nav style={{ justifyContent: 'center', alignItems: 'center' }}>
                          <MDBBtn circle size="lg" tag="a" floating social="li" href="https://linkedin.com/in/leoronne" target="_blank">
                            <Linkedin color='plain' />
                          </MDBBtn>
                          <MDBBtn circle size="lg" tag="a" floating social="git" href="https://github.com/leoronne" target="_blank">
                            <Github color='brand' />
                          </MDBBtn>
                        </Nav>
                      </MDBCardBody>
                    </MDBCard>
                  </MDBCol>
                </MDBRow>
              </Container>

            </Card>
          </Col>
        </Row>
      </>
    );
  }
}

export default About;
