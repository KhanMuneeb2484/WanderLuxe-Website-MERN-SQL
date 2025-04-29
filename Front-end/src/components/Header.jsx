import React, { useState, useEffect, useContext } from "react";
import { Modal, Button, Form, Dropdown, Alert } from "react-bootstrap";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import "./Header.css";

const Header = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/users/register-user", {
        ...formData,
        password_hash: formData.password,
        role: "user",
      });
      if (response.data) {
        setShowRegisterModal(false);
        navigate("/login");
      } else {
        setErrorMessage(response.data.message || "Registration failed.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      {/* Navbar Start */}
      <div className="container-fluid position-relative p-0">
        <nav
          className={`navbar navbar-expand-lg fixed-top px-4 py-2 ${navbarClass}`}
          style={{ background: "rgba(33, 37, 41, 0.85)" }}
        >
          <Link to="/" className="navbar-brand p-0">
            <img
              src="/assets/img/LOGO1.png"
              alt="Wander Luxe Logo"
              style={{ height: "110px" }}
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
                  <Dropdown.Toggle
                    variant="light"
                    id="dropdown-basic"
                    className="d-flex align-items-center px-3 py-2 bg-white text-dark border rounded shadow-sm"
                    style={{ cursor: "pointer" }}
                  >
                    <span className="fw-bold">{user.name}</span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="shadow">
                    <Dropdown.Item
                      onClick={() => navigate("/dashboard")}
                      className="d-flex align-items-center"
                    >
                      <FaUser className="me-2" /> View Profile
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      onClick={logout}
                      className="d-flex align-items-center text-danger"
                    >
                      <FaSignOutAlt className="me-2" /> Logout
                    </Dropdown.Item>
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
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
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
            <Button
              variant="primary"
              className="w-100 py-3 mb-4 fw-bold shadow"
              type="submit"
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Header;
