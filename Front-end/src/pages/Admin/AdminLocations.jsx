import React, { useEffect, useState, useContext } from "react";
import { Table, Button, Container, Alert, Form, Modal } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";

const AdminLocations = () => {
  const [locations, setLocations] = useState([]);
  const [cities, setCities] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    location_name: "",
    price_per_person: "",
    city_id: "",
    id: null,
  });
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    fetchLocations(token);
    fetchCities(token); // Fetch cities when the component mounts
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
        const errorText = await response.text();
        setErrorMessage(errorText || "Failed to fetch locations.");
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
      setErrorMessage("Something went wrong. Please try again.");
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
        const errorText = await response.text();
        setErrorMessage(errorText || "Failed to fetch cities.");
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const handleDelete = async (locationId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:3000/api/locations/delete-location/${locationId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        setLocations(locations.filter((location) => location.id !== locationId));
      } else {
        const errorText = await response.text();
        setErrorMessage(errorText || "Failed to delete location.");
      }
    } catch (error) {
      console.error("Error deleting location:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const handleShowModal = (location = { location_name: "", price_per_person: "", city_id: "", id: null }) => {
    setModalData(location);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalData({ location_name: "", price_per_person: "", city_id: "", id: null });
  };

  const handleSaveLocation = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
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
          location_name: modalData.location_name,
          price_per_person: modalData.price_per_person,
          city_id: modalData.city_id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (modalData.id) {
          setLocations(
            locations.map((location) =>
              location.id === modalData.id
                ? {
                    ...location,
                    location_name: modalData.location_name,
                    price_per_person: modalData.price_per_person,
                    city_id: modalData.city_id,
                  }
                : location
            )
          );
        } else {
          setLocations([...locations, data.location]);
        }
        handleCloseModal();
      } else {
        const errorText = await response.text();
        setErrorMessage(errorText || "Failed to save location.");
      }
    } catch (error) {
      console.error("Error saving location:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Location Management</h2>
      {errorMessage && (
        <Alert variant="danger" className="text-center">
          {errorMessage}
        </Alert>
      )}
      <Button className="mb-3" onClick={() => handleShowModal()}>
        Add Location
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>City Name</th>
            <th>Location Name</th>
            <th>Price Per Session</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {locations && locations.length > 0 ? (
            locations.map((location) => (
              <tr key={location.location_id}>
                <td>{location.location_id}</td>
                <td>{location.city_name}</td>
                <td>{location.location_name}</td>
                <td>{location.price_per_person}</td>
                <td>
                  <Button
                    variant="warning"
                    className="me-2"
                    onClick={() => handleShowModal(location)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(location.location_id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No locations found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal for Add/Edit */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalData.id ? "Edit Location" : "Add Location"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
          <Form.Group controlId="formCityId">
              <Form.Label>City</Form.Label>
              <Form.Control
                as="select"
                value={modalData.city_id}
                onChange={(e) =>
                  setModalData({ ...modalData, city_id: e.target.value })
                }
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city.city_id} value={city.city_id}>
                    {city.city_name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formLocationName">
              <Form.Label>Location Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter location name"
                value={modalData.location_name}
                onChange={(e) =>
                  setModalData({ ...modalData, location_name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formPricePerPerson">
              <Form.Label>Price Per Session</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={modalData.price_per_person}
                onChange={(e) =>
                  setModalData({ ...modalData, price_per_person: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveLocation}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminLocations;
