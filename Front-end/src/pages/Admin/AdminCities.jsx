import React, { useEffect, useState, useContext } from "react";
import { Table, Button, Container, Alert, Form, Modal } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";

const AdminCities = () => {
  const [cities, setCities] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ name: "", id: null });
  const { user, logout } = useContext(AuthContext);

  // Fetch cities on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    fetchCities(token);
  }, []);

  // Fetch all cities from the server
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
        console.log(data);
      } else {
        const errorText = await response.text();
        setErrorMessage(errorText || "Failed to fetch cities.");
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };


  const handleSaveNewCity = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    try {
        const response = await fetch("http://localhost:3000/api/cities/register-city", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          city_name: modalData.name, 
          country_id: modalData.id, 
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setCities([...cities, data]); // Update city list with new city
        handleCloseModal();
      } else {
        setErrorMessage("Failed to add city. Please try again.");
      }
    } catch (error) {
      console.error("Error adding city:", error);
      setErrorMessage("An error occurred while adding the city.");
    }
  };
  

  // Handle delete city action
  const handleDelete = async (cityId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:3000/api/cities/delete-city/${cityId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        setCities(cities.filter((city) => city.city_id !== cityId)); // fixed key to city_id
      } else {
        const errorText = await response.text();
        setErrorMessage(errorText || "Failed to delete city.");
      }
    } catch (error) {
      console.error("Error deleting city:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  // Show modal for adding or editing city
  const handleShowModal = (city = { name: "", id: null }) => {
    setModalData({ name: city.city_name || "", id: city.city_id || null }); // handle city_name and city_id
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setModalData({ name: "", id: null });
  };
  
  // Save new or updated city
  const handleSaveCity = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    const method = modalData.id ? "PUT" : "POST";
    const url = modalData.id
      ? `http://localhost:3000/api/cities/update-city/${modalData.id}`
      : "http://localhost:3000/api/cities";
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
          setCities(
            cities.map((city) =>
              city.city_id === modalData.id ? { ...city, city_name: modalData.name } : city
            )
          );
        } else {
          setCities([...cities, data.city]);
        }
        handleCloseModal();
      } else {
        const errorText = await response.text();
        setErrorMessage(errorText || "Failed to save city.");
      }
    } catch (error) {
      console.error("Error saving city:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
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
            <th>country ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cities && cities.length > 0 ? (
            cities.map((city) => (
              <tr key={city.city_id}>
                <td>{city.city_id}</td>
                <td>{city.country_id}</td>
                <td>{city.city_name}</td>
                <td>
                  <Button
                    variant="warning"
                    className="me-2"
                    onClick={() => handleShowModal(city)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(city.city_id)} // fixed city_id
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                No cities found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal for Add/Edit */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalData.id ? "Edit city" : "Add city"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formCountryName">
              <Form.Label>City Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter country name"
                value={modalData.name}
                onChange={(e) =>
                  setModalData({ ...modalData, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formCountryId">
              <Form.Label>Country id</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter country id"
                value={modalData.id}
                onChange={(e) =>
                  setModalData({ ...modalData, id: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          {/* {modalData.id ? ( */}
            <Button variant="primary" onClick={handleSaveCity}>
              Save Changes
            </Button>
        {/* //    ) : ( */}
            <Button variant="success" onClick={handleSaveNewCity}>
              Save New City
            </Button>
           {/* )} */}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminCities;
