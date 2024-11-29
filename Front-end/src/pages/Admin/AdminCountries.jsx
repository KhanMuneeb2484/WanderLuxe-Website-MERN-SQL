import React, { useEffect, useState, useContext } from "react";
import { Table, Button, Container, Alert, Form, Modal } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";

const AdminCountries = () => {
  const [countries, setCountries] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [modalData, setModalData] = useState({ name: "", continent: "", id: null });
  const [countryToDelete, setCountryToDelete] = useState(null); // To store the country being deleted
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchCountries(token);
    } else {
      setErrorMessage("User not authenticated. Please log in.");
    }
  }, []);

  const fetchCountries = async (token) => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/countries/get-all-countries",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCountries(data || []);
      } else {
        setErrorMessage("Failed to fetch countries. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
      setErrorMessage("An error occurred while fetching countries.");
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token || !countryToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/countries/delete-country/${countryToDelete}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setCountries(countries.filter((country) => country.country_id !== countryToDelete));
        setShowConfirmDeleteModal(false); // Close the confirmation modal
      } else {
        setErrorMessage("Failed to delete country. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting country:", error);
      setErrorMessage("An error occurred while deleting the country.");
    }
  };

  const handleShowModal = (country = { name: "", continent: "", id: null }) => {
    setModalData({
      id: country.country_id || null,
      name: country.country_name || "",
      continent: country.country_continent || "",
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalData({ name: "", continent: "", id: null });
  };

  const handleSaveCountry = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const method = modalData.id ? "PATCH" : "POST";
    const url = modalData.id
      ? `http://localhost:3000/api/countries/update-country/${modalData.id}`
      : "http://localhost:3000/api/countries";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          country_name: modalData.name,
          country_continent: modalData.continent,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (modalData.id) {
          setCountries(
            countries.map((country) =>
              country.country_id === modalData.id
                ? { ...country, country_name: modalData.name, country_continent: modalData.continent }
                : country
            )
          );
        } else {
          setCountries([...countries, data]);
        }
        handleCloseModal();
      } else {
        setErrorMessage("Failed to save country. Please try again.");
      }
    } catch (error) {
      console.error("Error saving country:", error);
      setErrorMessage("An error occurred while saving the country.");
    }
  };

  const handleSaveNewCountry = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("http://localhost:3000/api/countries/register-country", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          country_name: modalData.name,
          country_continent: modalData.continent,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCountries([...countries, data]);
        handleCloseModal();
      } else {
        setErrorMessage("Failed to add country. Please try again.");
      }
    } catch (error) {
      console.error("Error adding country:", error);
      setErrorMessage("An error occurred while adding the country.");
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Country Management</h2>
      {errorMessage && (
        <Alert variant="danger" className="text-center">
          {errorMessage}
        </Alert>
      )}
      <Button
        className="mb-3"
        onClick={() => handleShowModal({ name: "", continent: "", id: null })}
      >
        Add Country
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Continent</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {countries.length > 0 ? (
            countries.map((country) => (
              <tr key={country.country_id}>
                <td>{country.country_id}</td>
                <td>{country.country_name}</td>
                <td>{country.country_continent}</td>
                <td>
  <div className="d-flex justify-content-between w-50">
    <Button
      variant="warning"
      className="me-3"
      onClick={() =>
        handleShowModal({
          country_id: country.country_id,
          country_name: country.country_name,
          country_continent: country.country_continent,
        })
      }
    >
      Edit
    </Button>
    <Button
      variant="danger"
      onClick={() => {
        setCountryToDelete(country.country_id); // Set country for deletion
        setShowConfirmDeleteModal(true); // Show confirmation modal
      }}
    >
      Delete
    </Button>
  </div>
</td>
                {/* <td>
                  <Button
                    variant="warning"
                    className="me-2"
                    onClick={() =>
                      handleShowModal({
                        country_id: country.country_id,
                        country_name: country.country_name,
                        country_continent: country.country_continent,
                      })
                    }
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      setCountryToDelete(country.country_id); // Set country for deletion
                      setShowConfirmDeleteModal(true); // Show confirmation modal
                    }}
                  >
                    Delete
                  </Button>
                </td> */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No countries found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Confirmation Modal for Deletion */}
      <Modal show={showConfirmDeleteModal} onHide={() => setShowConfirmDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this country?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

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
            <Form.Group controlId="formCountryContinent">
              <Form.Label>Country Continent</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter country continent"
                value={modalData.continent}
                onChange={(e) =>
                  setModalData({ ...modalData, continent: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          {modalData.id ? (
            <Button variant="primary" onClick={handleSaveCountry}>
              Save Changes
            </Button>
          ) : (
            <Button variant="primary" onClick={handleSaveNewCountry}>
              Save Country
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminCountries;
