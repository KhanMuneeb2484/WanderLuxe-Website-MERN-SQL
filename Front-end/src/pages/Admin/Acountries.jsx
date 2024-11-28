import React, { useEffect, useState, useContext } from "react";
import {
  Table,
  Button,
  Container,
  Alert,
  Form,
  Modal,
  Dropdown,
} from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const ACountries = () => {
  const [countries, setCountries] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ name: "", id: null });
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    fetchCountries(token);
  }, []);

  const fetchCountries = async (token) => {
    try {
      const response = await fetch("http://localhost:3000/api/countries", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCountries(data.countries || []);
      } else {
        const errorText = await response.text();
        setErrorMessage(errorText || "Failed to fetch countries.");
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const handleDelete = async (countryId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:3000/api/countries/${countryId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        setCountries(countries.filter((country) => country.id !== countryId));
      } else {
        const errorText = await response.text();
        setErrorMessage(errorText || "Failed to delete country.");
      }
    } catch (error) {
      console.error("Error deleting country:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const handleShowModal = (country = { name: "", id: null }) => {
    setModalData(country);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalData({ name: "", id: null });
  };

  const handleSaveCountry = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    const method = modalData.id ? "PUT" : "POST";
    const url = modalData.id
      ? `http://localhost:3000/api/countries/${modalData.id}`
      : "http://localhost:3000/api/countries";
    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: modalData.name }),
      });

      if (response.ok) {
        const data = await response.json();
        if (modalData.id) {
          setCountries(
            countries.map((country) =>
              country.id === modalData.id
                ? { ...country, name: modalData.name }
                : country
            )
          );
        } else {
          setCountries([...countries, data.country]);
        }
        handleCloseModal();
      } else {
        const errorText = await response.text();
        setErrorMessage(errorText || "Failed to save country.");
      }
    } catch (error) {
      console.error("Error saving country:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

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
              <Link to="/admin/admin" className="nav-item nav-link text-white">
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
              <Link to="/admin/users" className="nav-item nav-link text-white">
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

      <Container className="mt-5 pt-5">
        <h2 className="text-center mb-4">Country Management</h2>
        {errorMessage && (
          <Alert variant="danger" className="text-center">
            {errorMessage}
          </Alert>
        )}
        <Button className="mb-3" onClick={() => handleShowModal()}>
          Add Country
        </Button>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {countries && countries.length > 0 ? (
              countries.map((country) => (
                <tr key={country.id}>
                  <td>{country.id}</td>
                  <td>{country.name}</td>
                  <td>
                    <Button
                      variant="warning"
                      className="me-2"
                      onClick={() => handleShowModal(country)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(country.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  No countries found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Modal for Add/Edit */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>
              {modalData.id ? "Edit Country" : "Add Country"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formCountryName">
                <Form.Label>Country Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter country name"
                  value={modalData.name}
                  onChange={(e) =>
                    setModalData({ ...modalData, name: e.target.value })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveCountry}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default ACountries;
