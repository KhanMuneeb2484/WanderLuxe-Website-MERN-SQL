import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Button, Dropdown } from "react-bootstrap";

const Admin = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    if (decodedToken.role !== "admin") {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div>
      {/* Admin Navbar Start */}
      <div className="container-fluid position-relative p-0">
        <nav
          className="navbar navbar-expand-lg fixed-top px-4 py-3"
          style={{ background: "rgba(33, 37, 41, 0.85)" }}
        >
          <Link to="/admin" className="navbar-brand p-0">
            <h1 className="text-white m-0">Admin Panel</h1>
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
              <Link to="/admin/Admin" className="nav-item nav-link text-white">
                Home
              </Link>
              <Link
                to="/admin/packages"
                className="nav-item nav-link text-white"
              >
                Packages
              </Link>
              <Link
                to="/admin/countries"
                className="nav-item nav-link text-white"
              >
                Countries
              </Link>
              <Link to="/admin/cities" className="nav-item nav-link text-white">
                Cities
              </Link>
              <Link to="/admin/hotels" className="nav-item nav-link text-white">
                Hotels
              </Link>
              <Link
                to="/admin/tour-guides"
                className="nav-item nav-link text-white"
              >
                Tour Guides
              </Link>
              <Link
                to="/admin/locations"
                className="nav-item nav-link text-white"
              >
                Locations
              </Link>
              <Link
                to="/admin/bookings"
                className="nav-item nav-link text-white"
              >
                Bookings
              </Link>
              <Link to="/admin/Users" className="nav-item nav-link text-white">
                Users
              </Link>
            </div>
            <div className="d-flex align-items-center ms-3">
              <Dropdown align="end">
                <Dropdown.Toggle variant="light" id="dropdown-basic">
                  <img
                    src={user?.profilePicture || "/default-profile.png"}
                    alt="Profile"
                    style={{ width: "30px", borderRadius: "50%" }}
                  />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </nav>
      </div>
      {/* Admin Navbar End */}

      <div className="container mt-5">
        <h2 className="text-center mt-5 pt-5">Welcome to Admin Dashboard</h2>
        {/* Content for the admin dashboard can be added here */}
      </div>
    </div>
  );
};

export default Admin;
