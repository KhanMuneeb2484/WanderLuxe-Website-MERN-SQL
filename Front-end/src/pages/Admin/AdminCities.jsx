import React, { useEffect, useState, useContext } from "react";
import { Table, Button, Container, Alert, Modal, Form } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";

const AdminCities = () => {
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [modalData, setModalData] = useState({ name: "", country: "", id: null });
  const [cityToDelete, setCityToDelete] = useState(null);
  const [image, setImage] = useState(null); // To store the selected image
  const [selectedCityId, setSelectedCityId] = useState(null); // Store the city ID to upload the image to
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchCities(token);
      fetchCountries(token);
    } else {
      setErrorMessage("User not authenticated. Please log in.");
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
        setErrorMessage("Failed to fetch cities. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
      setErrorMessage("An error occurred while fetching cities.");
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
        console.log(data); // Check the country data
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
    if (!token || !cityToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/cities/delete-city/${cityToDelete}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setCities(cities.filter((city) => city.city_id !== cityToDelete));
        setShowConfirmDeleteModal(false); // Close the confirmation modal
      } else {
        setErrorMessage("Failed to delete city. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting city:", error);
      setErrorMessage("An error occurred while deleting the city.");
    }
  };

  const handleShowModal = (city = { name: "", country: "", id: null }) => {
    setModalData({
      id: city.city_id || null,
      name: city.city_name || "",
      country: city.country_id || "",
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalData({ name: "", country: "", id: null });
  };

  const handleSaveCity = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const method = modalData.id ? "PATCH" : "POST";
    const url = modalData.id
      ? `http://localhost:3000/api/cities/update-city/${modalData.id}`
      : "http://localhost:3000/api/cities/register-city";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          city_name: modalData.name,
          country_id: modalData.country,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (modalData.id) {
          setCities(
            cities.map((city) =>
              city.city_id === modalData.id
                ? { ...city, city_name: modalData.name, country_id: modalData.country }
                : city
            )
          );
        } else {
          setCities([...cities, data]);
        }
        handleCloseModal();
      } else {
        setErrorMessage("Failed to save city. Please try again.");
      }
    } catch (error) {
      console.error("Error saving city:", error);
      setErrorMessage("An error occurred while saving the city.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Set the selected image to the image state
    }
  };

  const handleImageUpload = async () => {
    const token = localStorage.getItem("token");
    if (!token || !selectedCityId || !image) return;

    const imageFormData = new FormData();
    imageFormData.append("image", image);

    try {
      const imageResponse = await fetch(
        `http://localhost:3000/api/pictures/upload/city/${selectedCityId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: imageFormData,
        }
      );

      if (!imageResponse.ok) {
        setErrorMessage("Failed to upload image. Please try again.");
      } else {
        console.log("Image uploaded successfully.");
        // Optionally refresh the city's data or refresh the list after image upload
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setErrorMessage("An error occurred while uploading the image.");
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">City Management</h2>

      {/* Error Message */}
      {errorMessage && (
        <Alert variant="danger" className="text-center mb-3">
          {errorMessage}
        </Alert>
      )}

      {/* Add City Button */}
      <div className="d-flex justify-content-start mb-3">
        <Button
          onClick={() => handleShowModal({ name: "", country: "", id: null })}
          variant="primary"
        >
          Add City
        </Button>
      </div>

      {/* City Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Country</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cities.length > 0 ? (
            cities.map((city) => (
              <tr key={city.city_id}>
                <td>{city.city_id}</td>
                <td>{city.city_name}</td>
                <td>{city.country_name}</td>
                <td>
                  <div className="d-flex justify-content-start gap-3 align-items-center">
                    {/* Edit Button */}
                    <Button
                      variant="warning"
                      onClick={() =>
                        handleShowModal({
                          city_id: city.city_id,
                          city_name: city.city_name,
                          country_id: city.country_id,
                        })
                      }
                    >
                      Edit
                    </Button>

                    {/* Delete Button */}
                    <Button
                      variant="danger"
                      onClick={() => {
                        setCityToDelete(city.city_id);
                        setShowConfirmDeleteModal(true);
                      }}
                    >
                      Delete
                    </Button>

                    {/* Unified Image Upload Button */}
                    <Button
                      variant={city.picture_url ? "warning" : "success"}
                      onClick={() => setSelectedCityId(city.city_id)}
                    >
                      {city.picture_url ? "Update Image" : "Upload Image"}
                    </Button>

                    {/* View Image Button */}
                    {city.picture_url && (
                      <Button
                        variant="info"
                        onClick={() => window.open(city.picture_url, "_blank")}
                      >
                        View Image
                      </Button>
                    )}
                  </div>

                  {/* Image Upload Section */}
                  {selectedCityId === city.city_id && (
                    <div className="mt-2">
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      {image && <p>Selected image: {image.name}</p>}
                      <Button variant="success" onClick={handleImageUpload}>
                        Upload
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No cities available.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal for City Form */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalData.id ? "Edit City" : "Add City"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formCityName">
              <Form.Label>City Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter city name"
                value={modalData.name}
                onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formCountrySelect">
              <Form.Label>Country</Form.Label>
              <Form.Control
                as="select"
                value={modalData.country}
                onChange={(e) =>
                  setModalData({ ...modalData, country: e.target.value })
                }
              >
                <option value="">Select a country</option>
                {countries.length > 0 &&
                  countries.map((country) => (
                    <option key={country.country_id} value={country.country_id}>
                      {country.country_name}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveCity}>
            {modalData.id ? "Save Changes" : "Add City"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirmation Modal for Deletion */}
      <Modal
        show={showConfirmDeleteModal}
        onHide={() => setShowConfirmDeleteModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this city?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmDeleteModal(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminCities;
