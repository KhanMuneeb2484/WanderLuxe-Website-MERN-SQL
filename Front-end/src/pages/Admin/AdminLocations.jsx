import React, { useEffect, useState, useContext } from "react";
import { Table, Button, Container, Alert, Modal, Form } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";

const AdminLocations = () => {
  const [locations, setLocations] = useState([]);
  const [cities, setCities] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [modalData, setModalData] = useState({ name: "", city: "", price_per_person: "", id: null });
  const [locationToDelete, setLocationToDelete] = useState(null);
  const [image, setImage] = useState(null); // Store the selected image
  const [selectedLocationId, setSelectedLocationId] = useState(null); // Store the location ID to upload the image to
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchLocations(token);
      fetchCities(token);
    } else {
      setErrorMessage("User not authenticated. Please log in.");
    }
  }, []);

  const fetchLocations = async (token) => {
    try {
      const response = await fetch("http://localhost:3000/api/locations/get-all-locations", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLocations(data || []);
      } else {
        setErrorMessage("Failed to fetch locations. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
      setErrorMessage("An error occurred while fetching locations.");
    }
  };

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

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token || !locationToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/locations/delete-location/${locationToDelete}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setLocations(locations.filter((location) => location.location_id !== locationToDelete));
        setShowConfirmDeleteModal(false);
      } else {
        setErrorMessage("Failed to delete location. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting location:", error);
      setErrorMessage("An error occurred while deleting the location.");
    }
  };

  const handleShowModal = (location = { name: "", city: "", price_per_person: "", id: null }) => {
    setModalData({
      id: location.location_id || null,
      name: location.location_name || "",
      city: location.city_id || "",
      price_per_person: location.price_per_person || "",
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalData({ name: "", city: "", price_per_person: "", id: null });
  };

  const handleSaveLocation = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const method = modalData.id ? "PATCH" : "POST";
    const url = modalData.id
      ? `http://localhost:3000/api/locations/update-location/${modalData.id}`
      : "http://localhost:3000/api/locations/register-location";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          location_name: modalData.name,
          city_id: modalData.city,
          price_per_person: modalData.price_per_person,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (modalData.id) {
          setLocations(
            locations.map((location) =>
              location.location_id === modalData.id
                ? { ...location, location_name: modalData.name, city_id: modalData.city, price_per_person: modalData.price_per_person }
                : location
            )
          );
        } else {
          setLocations((prevLocations) => [...prevLocations, data]);
        }
        handleCloseModal();
        fetchLocations(token); // Refresh locations list after saving
      } else {
        setErrorMessage("Failed to save location. Please try again.");
      }
    } catch (error) {
      console.error("Error saving location:", error);
      setErrorMessage("An error occurred while saving the location.");
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
    if (!token || !selectedLocationId || !image) return;

    const imageFormData = new FormData();
    imageFormData.append("image", image);

    try {
      const imageResponse = await fetch(
        `http://localhost:3000/api/pictures/upload/location/${selectedLocationId}`,
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
        fetchLocations(token); // Refresh locations list after image upload
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setErrorMessage("An error occurred while uploading the image.");
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Location Management</h2>

      {/* Error Message */}
      {errorMessage && (
        <Alert variant="danger" className="text-center mb-3">
          {errorMessage}
        </Alert>
      )}

      {/* Add Location Button */}
      <div className="d-flex justify-content-start mb-3">
        <Button
          onClick={() => handleShowModal({ name: "", city: "", price_per_person: "", id: null })}
          variant="primary"
        >
          Add Location
        </Button>
      </div>

      {/* Location Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>City</th>
            <th>Price per Person</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {locations.length > 0 ? (
            locations.map((location) => (
              <tr key={location.location_id}>
                <td>{location.location_id}</td>
                <td>{location.location_name}</td>
                <td>{location.city_name}</td>
                <td>{location.price_per_person}</td>
                <td>
                  <div className="d-flex justify-content-start gap-3 align-items-center">
                    {/* Edit Button */}
                    <Button
                      variant="warning"
                      onClick={() =>
                        handleShowModal({
                          location_id: location.location_id,
                          location_name: location.location_name,
                          city_id: location.city_id,
                          price_per_person: location.price_per_person,
                        })
                      }
                    >
                      Edit
                    </Button>

                    {/* Delete Button */}
                    <Button
                      variant="danger"
                      onClick={() => {
                        setLocationToDelete(location.location_id);
                        setShowConfirmDeleteModal(true);
                      }}
                    >
                      Delete
                    </Button>

                    {/* Unified Image Upload Button */}
                    <Button
                      variant={location.picture_url ? "warning" : "success"}
                      onClick={() => setSelectedLocationId(location.location_id)}
                    >
                      {location.picture_url ? "Update Image" : "Upload Image"}
                    </Button>

                    {/* View Image Button */}
                    {location.picture_url && (
                      <Button
                        variant="info"
                        onClick={() => window.open(location.picture_url, "_blank")}
                      >
                        View Image
                      </Button>
                    )}
                  </div>

                  {/* Image Upload Modal */}
                  <Modal show={selectedLocationId === location.location_id} onHide={() => setSelectedLocationId(null)}>
                    <Modal.Header closeButton>
                      <Modal.Title>Upload Image for {location.location_name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form>
                        <Form.Group controlId="formFile" className="mb-3">
                          <Form.Label>Choose Image</Form.Label>
                          <Form.Control type="file" onChange={handleImageChange} />
                        </Form.Group>
                      </Form>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={() => setSelectedLocationId(null)}>
                        Close
                      </Button>
                      <Button variant="primary" onClick={handleImageUpload}>
                        Upload Image
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No locations available.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Confirm Delete Modal */}
      <Modal show={showConfirmDeleteModal} onHide={() => setShowConfirmDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this location?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Location Edit/Add Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalData.id ? "Edit Location" : "Add Location"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formLocationName" className="mb-3">
              <Form.Label>Location Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter location name"
                value={modalData.name}
                onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="formCity" className="mb-3">
              <Form.Label>City</Form.Label>
              <Form.Control
                as="select"
                value={modalData.city}
                onChange={(e) => setModalData({ ...modalData, city: e.target.value })}
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city.city_id} value={city.city_id}>
                    {city.city_name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formPricePerPerson" className="mb-3">
              <Form.Label>Price per Person</Form.Label>
              <Form.Control
                type="number"
                value={modalData.price_per_person}
                onChange={(e) => setModalData({ ...modalData, price_per_person: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveLocation}>
            Save Location
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminLocations;
