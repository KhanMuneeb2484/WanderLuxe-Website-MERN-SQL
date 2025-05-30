import React, { useState, useEffect, useContext } from "react";
import { Modal, Button, Form, Dropdown, Alert } from "react-bootstrap";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import "./Header.css";

const Header = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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
      setIsScrolled(window.scrollY > 0);
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
          className={`navbar navbar-expand-lg fixed-top px-4 py-1 ${isScrolled ? 'navbar-scrolled' : 'navbar-transparent'}`}
          style={{ 
            height: "120px",
            paddingTop: "10px",
            paddingBottom: "10px"
          }}
        >
          <Link to="/" className="navbar-brand p-0">
            <img
              src="/assets/img/logo1.svg"
              alt="Wander Luxe Logo"
              style={{
                height: "150px",
                width: "150px",
                transform: "scale(2)",
                transformOrigin: "left center",
              }}
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
              <Link to="/About" className="nav-item nav-link">
                About
              </Link>
              <Link to="/Packages" className="nav-item nav-link">
                Packages
              </Link>
              <Link to="/Destination" className="nav-item nav-link">
                Destination
              </Link>
              <Link to="/Booking" className="nav-item nav-link">
                Booking
              </Link>
              <Link to="/Contact" className="nav-item nav-link">
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
                <Link
                  to="/Register"
                  className="btn btn-outline-light rounded-pill py-2 px-4 ms-3"
                >
                  Register
                </Link>
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

    </div>
  );
};

export default Header;