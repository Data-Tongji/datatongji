import React from "react";

// reactstrap components
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardText,
  Row,
  Col
} from "reactstrap";

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    }
  }

  async componentDidMount() {
    const token = localStorage.getItem('token');
    const response = await fetch(`https://api-data-statistic.herokuapp.com/auth/get_user?token=${token}`)
    const responseJson = await response.json()
    this.setState({ data: responseJson })
  };

  // handleBgClick = color => {
  //   this.setState({ backgroundColor: color });
  // };

  // activateMode = mode => {
  //   switch (mode) {
  //     case "light":
  //       document.body.classList.add("white-content");
  //       break;
  //     default:
  //       document.body.classList.remove("white-content");
  //       break;
  //   }
  // };

  render() {
    return (
      <>
        <div className="content">
          <Row>
            <Col md="12">
              <Card className="card-user">
                <CardBody>
                  <CardText />
                  <div className="author">
                    <div className="block block-one" />
                    <div className="block block-two" />
                    <div className="block block-three" />
                    <div className="block block-four" />
                    <a href="#pablo" onClick={e => e.preventDefault()}>
                      <img
                        alt="..."
                        className="avatar"
                        src={require("assets/img/user.svg")}
                      />
                      <h5 className="title">{this.state.data.name}</h5>
                    </a>
                    <p className="description">{this.state.data.email}</p>
                  </div>
                  <div className="card-description">
                    {/* <div className="fixed-plugin">
                      <div className={this.state.classes}>
                        <ul className="config-color show">
                          <li className="header-title">SIDEBAR BACKGROUND</li>
                          <li className="adjustments-line">
                            <div className="badge-colors text-center">
                              <span
                                className={
                                  this.props.bgColor === "primary"
                                    ? "badge filter badge-primary active"
                                    : "badge filter badge-primary"
                                }
                                data-color="primary"
                                onClick={() => {
                                  this.props.handleBgClick("primary");
                                }}
                              />{" "}
                              <span
                                className={
                                  this.props.bgColor === "blue"
                                    ? "badge filter badge-info active"
                                    : "badge filter badge-info"
                                }
                                data-color="blue"
                                onClick={() => {
                                  this.props.handleBgClick("blue");
                                }}
                              />{" "}
                              <span
                                className={
                                  this.props.bgColor === "green"
                                    ? "badge filter badge-success active"
                                    : "badge filter badge-success"
                                }
                                data-color="green"
                                onClick={() => {
                                  this.props.handleBgClick("green");
                                }}
                              />{" "}
                            </div>
                          </li>
                          <li className="adjustments-line text-center color-change">
                            <span className="color-label">LIGHT MODE</span>{" "}
                            <span
                              className="badge light-badge mr-2"
                              onClick={() => this.activateMode("light")}
                            />{" "}
                            <span
                              className="badge dark-badge ml-2"
                              onClick={() => this.activateMode("dark")}
                            />{" "}
                            <span className="color-label">DARK MODE</span>{" "}
                          </li>
                          <li className="button-container"> */}
                            {/* <Button
                href="https://www.creative-tim.com/product/black-dashboard-react"
                color="primary"
                block
                className="btn-round"
              >
                Download Now
              </Button> */}
                            {/* <Button
                              color="default"
                              block
                              className="btn-round"
                              outline
                              href="https://demos.creative-tim.com/black-dashboard-react/#/documentation/tutorial"
                            >
                              Documentation
              </Button> */}
                          {/* </li> */}
                          {/* <li className="header-title">Want more components?</li>
            <li className="button-container">
              <Button
                href="https://www.creative-tim.com/product/black-dashboard-pro-react"
                className="btn-round"
                disabled
                block
                color="danger"
              >
                Get pro version
              </Button>
            </li> */}
                        {/* </ul>
                      </div>
                    </div> */}
                  </div>

                </CardBody>
                <CardFooter>
                  <div className="button-container">
                    <Button className="btn-icon btn-round" color="facebook">
                      <i className="fab fa-facebook" />
                    </Button>
                    <Button className="btn-icon btn-round" color="twitter">
                      <i className="fab fa-twitter" />
                    </Button>
                    <Button className="btn-icon btn-round" color="google">
                      <i className="fab fa-google-plus" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default UserProfile;
