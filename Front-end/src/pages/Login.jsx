import React, { useState } from "react";
import { Button, Form, Container, Row, Col, Modal } from "react-bootstrap";
import { FaGoogle } from "react-icons/fa";
import { Link } from "react-router-dom";

const Login = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPasswordModal(true);
  };

  const handleCloseForgotPassword = () => {
    setShowForgotPasswordModal(false);
  };

  return (
    <Container className="login-container mt-5">
      <Row className="align-items-center justify-content-center">
        <Col lg={6} className="p-5">
          <h2 className="mb-4 fw-bold">Welcome back</h2>
          <p className="mb-4 text-muted">Please enter your details</p>
          <Form>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                className="p-3 border-0 shadow-sm"
              />
            </Form.Group>
            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                className="p-3 border-0 shadow-sm"
              />
            </Form.Group>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Form.Check
                type="checkbox"
                label="Remember for 30 days"
                checked={rememberMe}
                onChange={handleRememberMeChange}
              />
              <span
                className="text-decoration-none text-primary"
                style={{ cursor: "pointer" }}
                onClick={handleForgotPasswordClick}
              >
                Forgot password?
              </span>
            </div>
            <Button
              variant="primary"
              className="w-100 py-3 mb-4 fw-bold shadow-lg"
            >
              Sign in
            </Button>
          </Form>
          <Button
            variant="outline-danger"
            className="rounded-pill p-3 mb-2 w-100 shadow-sm d-flex align-items-center justify-content-center"
            onClick={() =>
              (window.location.href = "https://accounts.google.com")
            }
          >
            <FaGoogle size={20} className="me-2" /> Sign in with Google
          </Button>
          <div className="text-center mt-4">
            <p className="fw-bold">
              Don't have an account?{" "}
              <Link to="/Register" className="text-primary">
                Sign up
              </Link>
            </p>
          </div>
        </Col>
        <Col lg={6} className="d-none d-lg-block bg-light-purple">
          <div className="d-flex align-items-center justify-content-center h-100">
            <img
              src="/assets/img/login-illustration.svg"
              alt="login illustration"
              className="img-fluid"
              style={{ width: "80%" }}
            />
          </div>
        </Col>
      </Row>

      {/* Forgot Password Modal */}
      <Modal
        show={showForgotPasswordModal}
        onHide={handleCloseForgotPassword}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Forgot Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted mb-4">
            Enter your email address to reset your password.
          </p>
          <Form>
            <Form.Group controlId="forgotPasswordEmail" className="mb-3">
              <Form.Control
                type="email"
                placeholder="Enter your email"
                className="p-3 border-0 shadow-sm"
              />
            </Form.Group>
            <Button variant="primary" className="w-100 py-3 fw-bold shadow-lg">
              Send Reset Link
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Login;

// Inline CSS
const styles = `
  .login-container {
    max-width: 900px;
    background: #ffffff;
    box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    overflow: hidden;
  }
  .bg-light-purple {
    background: #e6e6fa;
  }
  h2 {
    color: #3d3d5c;
  }
  .fw-bold {
    font-weight: 700;
  }
  .text-primary {
    color: #6c63ff;
  }
  .btn-primary {
    background-color: #6c63ff;
    border: none;
    transition: background-color 0.3s ease;
  }
  .btn-primary:hover {
    background-color: #574b90;
  }
  .btn-outline-danger {
    border-color: #ea4335;
    color: #ea4335;
    transition: all 0.3s ease;
  }
  .btn-outline-danger:hover {
    background-color: #ea4335;
    color: #ffffff;
  }
  .rounded-pill {
    border-radius: 50px;
  }
  .shadow-sm {
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }
  .shadow-lg {
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
  }
  .text-decoration-none {
    text-decoration: none !important;
  }
  .text-muted {
    color: #6c757d;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
