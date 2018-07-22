import React from "react";
import Container from "../components/Container";
import Row from "../components/Row";
import Col from "../components/Col";
// import Nav from "../components/Nav";
import LoginForm from "../components/LoginForm";


const About  = () => (
  <div>
      <Container style={{ marginTop: 30 }}>
        <Row>
          <Col size="md-12">
            
            <LoginForm />
            
          </Col>
        </Row>
      </Container>
  </div>
    );
    
    export default About;
    


