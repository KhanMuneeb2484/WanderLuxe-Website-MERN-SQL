import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

const Contact = () => {
  return (
    <Container className="py-5">
      <div className="text-center mb-5 mt-5">
        <h2 className="display-4">Get in Touch</h2>
      </div>
      <Row className="text-center mb-5">
        <Col md={4} className="mb-4">
          <i className="fas fa-map-marker-alt fa-3x mb-3 text-primary"></i>
          <h3>Address</h3>
          <p>Wanderluxe Head Office</p>
          <p>123 Travel Street, Explorer City, EX 45678</p>
        </Col>
        <Col md={4} className="mb-4">
          <i className="fas fa-phone-alt fa-3x mb-3 text-primary"></i>
          <h3>Phone</h3>
          <p>General Inquiries: (123) 456-7890</p>
          <p>Customer Support: (123) 456-7891</p>
        </Col>
        <Col md={4} className="mb-4">
          <i className="fas fa-envelope fa-3x mb-3 text-primary"></i>
          <h3>Email</h3>
          <p>info@wanderluxe.com</p>
          <p>support@wanderluxe.com</p>
        </Col>
      </Row>

      <div className="text-center mb-4">
        <h2 className="display-5">Message Us</h2>
      </div>
      <Form>
        <Row className="mb-3">
          <Col md={6} className="mb-3">
            <Form.Control
              type="text"
              name="firstName"
              placeholder="First Name"
              required
            />
          </Col>
          <Col md={6} className="mb-3">
            <Form.Control
              type="text"
              name="lastName"
              placeholder="Last Name"
              required
            />
          </Col>
        </Row>
        <Form.Group className="mb-3">
          <Form.Control
            type="email"
            name="email"
            placeholder="Email"
            required
          />
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Control
            as="textarea"
            name="comments"
            placeholder="Your Message"
            required
            style={{ minHeight: "150px" }}
          />
        </Form.Group>
        <div className="text-center">
          <Button type="submit" variant="primary" size="lg">
            Send
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default Contact;
