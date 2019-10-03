import React from "react";

// reactstrap components
import {
  Card,
  CardText,
  Button,
  Row,
  Col,
  CardBody,
  CardFooter
} from "reactstrap";

class Expired extends React.Component {
  render() {
    return (
      <>
        <Row>
          <Col className="col_center" md="4">
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
                      src={require("assets/img/cancel.svg")}
                    />
                    <h5 className="title">Ops !!!</h5>
                  </a>
                  <p className="description">algo de errado não está certo !</p>
                </div>
                <div className="card-description">
                  Do not be scared of the truth because we need to restart the
                  human foundation in truth And I love you like Kanye loves
                  Kanye I love Rick Owens’ bed design but the back is...
             </div>
             <Button
                href="/#/"
                color="primary"
                block
                className="btn-round"
              >
               Login
              </Button>
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
      </>
    );
  }
}

export default Expired;
