import React, { useEffect, useState, useContext } from "react";
import { Table, Button, Container, Alert, Modal, Form } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";

const AdminCountries = () => {
  const [countries, setCountries] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [modalData, setModalData] = useState({ name: "", continent: "", id: null });
  const [countryToDelete, setCountryToDelete] = useState(null); // To store the country being deleted
  const { user, logout } = useContext(AuthContext);
  const [image, setImage] = useState(null); // To store the selected image
  const [selectedCountryId, setSelectedCountryId] = useState(null); // Store the country ID to upload the image to

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Set the selected image to the image state
    }
  };

  const handleImageUpload = async () => {
    const token = localStorage.getItem("token");
    if (!token || !selectedCountryId || !image) return;

    try {
      const imageFormData = new FormData();
      imageFormData.append("image", image);

      const imageResponse = await fetch(
        `http://localhost:3000/api/pictures/upload/country/${selectedCountryId}`,
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
        // You can optionally update the country's data or refresh the list after image upload
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setErrorMessage("An error occurred while uploading the image.");
    }
  };

  return (
    <Container className="mt-5">
    <h2 className="text-center mb-4">Country Management</h2>
  
    {/* Error Message */}
    {errorMessage && (
      <Alert variant="danger" className="text-center mb-3">
        {errorMessage}
      </Alert>
    )}
  
    {/* Add Country Button */}
    <div className="d-flex justify-content-start mb-3">
      <Button
        onClick={() => handleShowModal({ name: "", continent: "", id: null })}
        variant="primary"
      >
        Add Country
      </Button>
    </div>
  
    {/* Country Table */}
    <Table striped bordered hover responsive>
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
          <div className="d-flex justify-content-start gap-3 align-items-center">
            {/* Edit Button */}
            <Button
              variant="warning"
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

            {/* Delete Button */}
            <Button
              variant="danger"
              onClick={() => {
                setCountryToDelete(country.country_id); // Set country for deletion
                setShowConfirmDeleteModal(true); // Show confirmation modal
              }}
            >
              Delete
            </Button>

            {/* Unified Image Upload Button */}
            <Button
              variant={country.picture_url ? "warning" : "success"} // Change color based on image availability
              onClick={() => setSelectedCountryId(country.country_id)} // Set the selected country ID for image upload
            >
              {country.picture_url ? "Update Image" : "Upload Image"}
            </Button>

            {/* View Image Button */}
            {country.picture_url && (
              <Button
                variant="info" // Light blue for 'View Image' button
                onClick={() => window.open(country.picture_url, "_blank")} // Opens the image in a new tab
              >
                View Image
              </Button>
            )}
          </div>

          {/* Image Upload Section */}
          {selectedCountryId === country.country_id && (
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
        No countries found.
      </td>
    </tr>
  )}
</tbody>

    </Table>
  
    {/* Add/Edit Country Modal */}
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>{modalData.id ? "Edit Country" : "Add Country"}</Modal.Title>
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
  
          <Form.Group controlId="formContinent">
            <Form.Label>Continent</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter continent"
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
        <Button variant="primary" onClick={handleSaveCountry}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  
    {/* Confirm Delete Modal */}
    <Modal
      show={showConfirmDeleteModal}
      onHide={() => setShowConfirmDeleteModal(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete this country?
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

export default AdminCountries;
