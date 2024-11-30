import React, { useEffect, useState, useContext } from "react";
import { Table, Button, Container, Alert, Form, Modal } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";

const AdminCities = () => {
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [modalData, setModalData] = useState({ name: "", countryId: "", id: null });
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false); // Confirmation modal state
  const [cityToDelete, setCityToDelete] = useState(null); // Store city to be deleted
  const { user, logout } = useContext(AuthContext);

  // Fetch cities and countries on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchCities(token);
      fetchCountries(token);
    }
  }, []);

  const fetchCities = async (token) => {
    try {
      const response = await fetch("http://localhost:3000/api/cities/get-all-cities", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCities(data || []);
      } else {
        const errorText = await response.text();
        setErrorMessage(errorText || "Failed to fetch cities.");
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const fetchCountries = async (token) => {
    try {
      const response = await fetch("http://localhost:3000/api/countries/get-all-countries", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCountries(data || []);
      } else {
        setErrorMessage("Failed to fetch countries. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const handleNewCity = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:3000/api/cities/register-city", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          city_name: modalData.name,
          country_id: modalData.countryId,
        }),
      });

      if (response.ok) {
        const newCity = await response.json();
        setCities([...cities, newCity]);
        handleCloseModal();
      } else {
        setErrorMessage("Failed to add new city.");
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const handleDeleteCityConfirmation = (cityId) => {
    setCityToDelete(cityId); // Set the city to delete
    setShowDeleteConfirmModal(true); // Show the confirmation modal
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!cityToDelete) return;

    try {
      const response = await fetch(`http://localhost:3000/api/cities/delete-city/${cityToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setCities(cities.filter((city) => city.city_id !== cityToDelete));
        setShowDeleteConfirmModal(false); // Close the confirmation modal
      } else {
        setErrorMessage("Failed to delete city.");
        setShowDeleteConfirmModal(false); // Close the confirmation modal
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
      setShowDeleteConfirmModal(false); // Close the confirmation modal
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmModal(false); // Close the confirmation modal without deleting
    setCityToDelete(null); // Reset cityToDelete
  };

  const handleEditCity = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:3000/api/cities/update-city/${modalData.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ city_name: modalData.name, country_id: modalData.countryId }), // Correct keys
      });

      if (response.ok) {
        const updatedCity = await response.json(); // Ensure response is parsed as JSON
        setCities(
          cities.map((city) =>
            city.city_id === updatedCity.city_id
              ? {
                  ...city,
                  city_name: updatedCity.city_name,
                  country_id: updatedCity.country_id,
                }
              : city
          )
        );
        handleCloseModal();
      } else {
        const errorText = await response.text();
        setErrorMessage(errorText || "Failed to update city.");
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const handleShowModal = (city = { city_name: "", country_id: "" }) => {
    setIsEditing(!!city.city_id);
    setModalData({
      name: city.city_name || "",
      countryId: city.country_id || countries[0]?.id || "",
      id: city.city_id || "",
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalData({ name: "", countryId: "", id: "" });
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">City Management</h2>
      {errorMessage && (
        <Alert variant="danger" className="text-center">
          {errorMessage}
        </Alert>
      )}
      <Button className="mb-3" onClick={() => handleShowModal()}>
        Add City
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Country</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cities.length > 0 ? (
            cities.map((city) => (
              <tr key={city.city_id}>
                <td>{city.city_id}</td>
                <td>{city.country_id}</td>
                <td>{city.city_name}</td>
                <td>
                <div className="d-flex justify-content-between w-50">
  <Button
    variant="warning"
    className="me-3"
    onClick={() => handleShowModal(city)}
  >
    Edit
  </Button>
  <Button
    variant="danger"
    className="me-3"
    onClick={() => handleDeleteCityConfirmation(city.city_id)}
  >
    Delete
  </Button>
  
</div>

</td>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No cities found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Confirmation Modal */}
      <Modal show={showDeleteConfirmModal} onHide={handleCancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this city?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Edit City" : "Add City"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formCityName">
              <Form.Label>City Name</Form.Label>
              <Form.Control
                type="text"
                value={modalData.name}
                onChange={(e) =>
                  setModalData({ ...modalData, name: e.target.value })
                }
              />
            </Form.Group>

            {!isEditing && (
              <Form.Group controlId="formCountry">
                <Form.Label>Country</Form.Label>
                <Form.Control
                  as="select"
                  value={modalData.countryId}
                  onChange={(e) =>
                    setModalData({ ...modalData, countryId: e.target.value })
                  }
                >
                  {countries.map((country) => (
                    <option key={country.country_id} value={country.country_id}>
                      {country.country_name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button
            variant={isEditing ? "success" : "primary"}
            onClick={isEditing ? handleEditCity : handleNewCity}
          >
            {isEditing ? "Update" : "Add"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminCities;
