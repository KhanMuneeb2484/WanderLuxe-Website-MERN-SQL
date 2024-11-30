import React, { useState, useEffect, useContext } from "react";
import { Modal, Button, Form, Dropdown, Alert } from "react-bootstrap";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Corrected path
import axios from "axios";
import "./Header.css";

const Header = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [navbarClass, setNavbarClass] = useState("navbar-darkgrey-translucent");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

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
    navigate("/login");
  };

  const handleCheckboxChange = (e) => {
    setAgreeTerms(e.target.checked);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/users/register-user", {
        ...formData,
        password_hash: formData.password, // Backend expects password_hash
        role: "user", // Hardcoded role
      });
      if (response.data) {
        // Successfully registered
        setShowRegisterModal(false); // Close the modal
        navigate("/login"); // Redirect to login page
      } else {
        // Handle registration failure
        setErrorMessage(response.data.message || "Registration failed.");
      }
    } catch (error) {
      // Handle error (network issues, server errors, etc.)
      setErrorMessage("An error occurred. Please try again.");
    }
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
            {/* Replace the text with logo.svg */}
            <img
              src="/assets/img/logo.svg"  // Replace with the actual path to your logo.svg
              alt="Wander Luxe Logo"
              style={{ height: "100px" }} // Adjust height as needed
            />
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
            {user ? (
              <div className="d-flex align-items-center ms-3">
                <Dropdown align="end">
                  <Dropdown.Toggle variant="light" id="dropdown-basic">
                    <img
                      src={user.profilePicture || "/default-profile.png"}
                      alt="Profile"
                      style={{ width: "30px", borderRadius: "50%" }}
                    />
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => navigate("/dashboard")}>
                      View Profile
                    </Dropdown.Item>
                    <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            ) : (
              <>
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
              </>
            )}
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
          {errorMessage && (
            <Alert variant="danger">
              {errorMessage}
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="p-3 border-0 shadow-sm"
              />
            </Form.Group>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Control
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="p-3 border-0 shadow-sm"
              />
            </Form.Group>
            <Form.Group controlId="formPhoneNumber" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="p-3 border-0 shadow-sm"
              />
            </Form.Group>
            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="p-3 border-0 shadow-sm"
              />
            </Form.Group>
            <Form.Group controlId="formConfirmPassword" className="mb-3">
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
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
              type="submit"
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
                onClick={handleLoginRedirect}
                style={{ cursor: "pointer" }}
              >
                Login
              </span>
            </p>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Header;
