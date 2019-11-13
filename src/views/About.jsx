import React from "react";
import { MDBCardImage } from 'mdbreact';
import {
  Row,
  Col,
  CardText,
  Container,
  Card,
  CardBody,
  CardTitle,
  Nav,
  NavItem,
  Table
} from "reactstrap";
import { SocialIcon } from 'react-social-icons';

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
              <div class="react-card"></div>

              <Container style={{ justifyContent: 'center', width: '90%' }}>
                <Table responsive>
                  <thead>
                    <tr>
                      <th><MDBCardImage cascade className="img-fluid" src={require("assets/img/Lucas.jpg")} />
                        <br /><CardTitle style={{ textAlign: 'center' }}>Lucas Damas</CardTitle>
                        <Nav style={{ justifyContent: 'center', alignItems: 'center' }}>
                          <NavItem>
                            <SocialIcon sm url="https://linkedin.com/in/lucas-damas-corr%C3%AAa-882806176/" target="_blank" style={{ height: 30, width: 30 }} />
                          </NavItem>
                          <NavItem ><span>&nbsp;&nbsp;</span></NavItem >
                          <NavItem>
                            <SocialIcon sm url="https://github.com/lucasdcorrea1" target="_blank" style={{ height: 30, width: 30 }} fgColor="#000" />
                          </NavItem>
                        </Nav>
                      </th>
                      <th><MDBCardImage cascade className="img-fluid" src={require("assets/img/Leonardo.jpg")} />
                        <br /><CardTitle style={{ textAlign: 'center' }}>Leonardo Ronne</CardTitle>
                        <Nav style={{ justifyContent: 'center', alignItems: 'center' }}>
                          <NavItem>
                            <SocialIcon sm url="https://linkedin.com/in/leoronne" target="_blank" style={{ height: 30, width: 30 }} />
                          </NavItem>
                          <NavItem ><span>&nbsp;&nbsp;</span></NavItem >
                          <NavItem>
                            <SocialIcon sm url="https://github.com/leoronne" target="_blank" style={{ height: 30, width: 30 }} fgColor="#000" />
                          </NavItem>
                        </Nav>
                      </th>
                    </tr>
                  </thead>
                </Table></Container>
            </Card>
          </Col>
        </Row>
      </>
    );
  }
}

export default About;
