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
      <><Container style={{ justifyContent: 'center', width: '95%' }}>
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
                      style={{  maxWidth:'30%' }}
                      src={require("assets/img/logoTong.png")}
                    />
                  </a>
                </div>
                <div className="card-description" style={{ marginLeft: '2%', marginRight: '2%', textAlign: 'justify' }}>
                  <span class="unselectable" style={{ textAlign: 'justify' }}>
                    A good definition of statistics is based on being a set of methods especially appropriated for
                    collecting, presenting, analyzing and interpreting observation data, it aims the understanding of a
                  specific reality and help in decision making scenarios. This project was developed in order to optimize such analyzes by creating a web system, which focuses
                    on the presentation and interpretation of the expected data analysis results.</span>
                  <p /><span class="unselectable" style={{ textAlign: 'justify' }}>
                    In other words, Data Tongjì meets the needs of all users who are interested in making statistical analysis or calculations
                    (limited to Descriptive Analysis, Probability and Correlation and Regression operations), quickly and efficiently.
                    It's interface is pleasant and harmonious and does not require advanced knowledge for it's use, the user must inform the data
                    to be analyzed, the software will perform the calculations and the user should know how to interpret the results.
                  </span>
                </div>
              </CardBody ><br />
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
                </Table>
              </Container>
            </Card>
          </Col>
        </Row>
      </Container>
      </>
    );
  }
}

export default About;
