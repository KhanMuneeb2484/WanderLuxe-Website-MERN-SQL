import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [navbarClass, setNavbarClass] = useState("navbar-darkgrey-translucent");

  useEffect(() => {
    const handleScroll = () => {
      setNavbarClass(
        window.scrollY > 0 ? "navbar-black" : "navbar-darkgrey-translucent"
      );
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleShowRegister = () => setShowRegisterModal(true);
  const handleCloseRegister = () => setShowRegisterModal(false);
  const handleLoginRedirect = () => {
    handleCloseRegister();
    window.location.href = "/Login";
  };
  const handleCheckboxChange = (e) => {
    setAgreeTerms(e.target.checked);
  };

  return (
    <div>
      {/* Navbar Start */}
      <div className="container-fluid position-relative p-0">
        <nav
          className={`navbar navbar-expand-lg fixed-top px-4 py-3 ${navbarClass}`}
          style={{ background: "rgba(33, 37, 41, 0.85)" }}
        >
          <Link to="/" className="navbar-brand p-0">
            <h1 className="text-white m-0">Wander Luxe</h1>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCollapse"
          >
            <span className="fa fa-bars text-white" />
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <div className="navbar-nav ms-auto py-0">
              <Link to="/" className="nav-item nav-link text-white">
                Home
              </Link>
              <Link to="/About" className="nav-item nav-link text-white">
                About
              </Link>
              <Link to="/Packages" className="nav-item nav-link text-white">
                Packages
              </Link>
              <Link to="/Destination" className="nav-item nav-link text-white">
                Destination
              </Link>
              <Link to="/Booking" className="nav-item nav-link text-white">
                Booking
              </Link>
              <Link to="/Contact" className="nav-item nav-link text-white">
                Contact
              </Link>
            </div>
            <Button
              variant="warning"
              className="rounded-pill py-2 px-4 ms-3"
              onClick={handleShowRegister}
            >
              Register
            </Button>
            <Link
              to="/Login"
              className="btn btn-outline-light rounded-pill py-2 px-4 ms-3"
            >
              Login
            </Link>
          </div>
        </nav>
      </div>
      {/* Navbar End */}

      {/* Register Modal */}
      <Modal
        show={showRegisterModal}
        onHide={handleCloseRegister}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Sign in / Register</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-4">
            <h2 className="fw-bold">Your Adventure Starts Now</h2>
            <p className="text-muted">
              Receive our exclusive travel deals now!
            </p>
          </div>
          <Form>
            <Form.Group controlId="formName" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Name"
                className="p-3 border-0 shadow-sm"
              />
            </Form.Group>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Control
                type="email"
                placeholder="Email"
                className="p-3 border-0 shadow-sm"
              />
            </Form.Group>
            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Control
                type="password"
                placeholder="Password"
                className="p-3 border-0 shadow-sm"
              />
            </Form.Group>
            <Form.Group controlId="formConfirmPassword" className="mb-3">
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                className="p-3 border-0 shadow-sm"
              />
            </Form.Group>
            <Form.Group controlId="formCheckbox" className="mb-3">
              <Form.Check
                type="checkbox"
                label="I agree to the Terms and Conditions"
                onChange={handleCheckboxChange}
              />
            </Form.Group>
            <Button
              variant="primary"
              className="w-100 py-3 mb-4 fw-bold shadow"
              disabled={!agreeTerms}
            >
              Submit
            </Button>
          </Form>
          <div className="text-center mb-3">
            <hr className="my-4" />
            <span className="text-muted fw-bold">Or Sign In With</span>
            <hr className="my-4" />
          </div>
          <div className="d-flex justify-content-center gap-4 mb-4">
            <Button
              variant="outline-primary"
              className="rounded-circle p-3 shadow-sm"
              onClick={() => (window.location.href = "https://facebook.com")}
            >
              <FaFacebookF size={24} />
            </Button>
            <Button
              variant="outline-danger"
              className="rounded-circle p-3 shadow-sm"
              onClick={() =>
                (window.location.href = "https://accounts.google.com")
              }
            >
              <FaGoogle size={24} />
            </Button>
          </div>
          <div className="text-center mt-4">
            <p className="fw-bold">
              Already have an account?{" "}
              <span
                className="text-primary"
                style={{ cursor: "pointer" }}
                onClick={handleLoginRedirect}
              >
                Login here
              </span>
            </p>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Header;
