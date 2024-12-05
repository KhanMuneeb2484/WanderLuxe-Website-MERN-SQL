import React, { useEffect, useState, useContext } from "react";
import { Table, Button, Container, Alert, Modal, Form } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";

const AdminHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [cities, setCities] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [modalData, setModalData] = useState({
    hotel_name: "",
    city: "",
    room_type: "",
    price: "",
    amenities: "",
    number_of_rooms: "",
    availability: true,
    id: null,
  });
  const [hotelToDelete, setHotelToDelete] = useState(null);
  const [image, setImage] = useState(null); // Store the selected image
  const [selectedHotelId, setSelectedHotelId] = useState(null); // Store the hotel ID to upload the image to
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchHotels(token);
      fetchCities(token);
    } else {
      setErrorMessage("User not authenticated. Please log in.");
    }
  }, []);

  const fetchHotels = async (token) => {
    try {
      const response = await fetch("http://localhost:3000/api/hotels/get-all-hotels", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setHotels(data || []);
      } else {
        setErrorMessage("Failed to fetch hotels. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching hotels:", error);
      setErrorMessage("An error occurred while fetching hotels.");
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
    if (!token || !hotelToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/hotels/delete-hotel/${hotelToDelete}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setHotels(hotels.filter((hotel) => hotel.hotel_id !== hotelToDelete));
        setShowConfirmDeleteModal(false);
      } else {
        setErrorMessage("Failed to delete hotel. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting hotel:", error);
      setErrorMessage("An error occurred while deleting the hotel.");
    }
  };

  const handleShowModal = (hotel = {
    hotel_name: "",
    city: "",
    room_type: "",
    price: "",
    amenities: "",
    number_of_rooms: "",
    availability: true,
    id: null,
  }) => {
    setModalData({
      id: hotel.hotel_id || null,
      hotel_name: hotel.hotel_name || "",
      city: hotel.city_id || "",
      room_type: hotel.room_type || "",
      price: hotel.price || "",
      amenities: hotel.amenities || "",
      number_of_rooms: hotel.number_of_rooms || "",
      availability: hotel.availability || true,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalData({
      hotel_name: "",
      city: "",
      room_type: "",
      price: "",
      amenities: "",
      number_of_rooms: "",
      availability: true,
      id: null,
    });
  };

  const handleSaveHotel = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const method = modalData.id ? "PATCH" : "POST";
    const url = modalData.id
      ? `http://localhost:3000/api/hotels/update-hotel/${modalData.id}`
      : "http://localhost:3000/api/hotels/register-hotel";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          hotel_name: modalData.hotel_name,
          city_id: modalData.city,
          room_type: modalData.room_type,
          price: modalData.price,
          amenities: modalData.amenities,
          number_of_rooms: modalData.number_of_rooms,
          availability: modalData.availability,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (modalData.id) {
          setHotels(
            hotels.map((hotel) =>
              hotel.hotel_id === modalData.id
                ? { ...hotel, hotel_name: modalData.hotel_name, city_id: modalData.city, room_type: modalData.room_type, price: modalData.price, amenities: modalData.amenities, number_of_rooms: modalData.number_of_rooms, availability: modalData.availability }
                : hotel
            )
          );
        } else {
          setHotels((prevHotels) => [...prevHotels, data]);
        }
        handleCloseModal();
        fetchHotels(token); // Refresh hotels list after saving
      } else {
        setErrorMessage("Failed to save hotel. Please try again.");
      }
    } catch (error) {
      console.error("Error saving hotel:", error);
      setErrorMessage("An error occurred while saving the hotel.");
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
    if (!token || !selectedHotelId || !image) return;

    const imageFormData = new FormData();
    imageFormData.append("image", image);

    try {
      const imageResponse = await fetch(
        `http://localhost:3000/api/pictures/upload/hotel/${selectedHotelId}`,
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
        fetchHotels(token); // Refresh hotels list after image upload
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setErrorMessage("An error occurred while uploading the image.");
    }
  };

  // Function to view the image
  const handleViewImage = (hotelId) => {
    setSelectedHotelId(hotelId);
    // Assuming the image URL will be returned or constructed from hotel data
    const hotel = hotels.find((h) => h.hotel_id === hotelId);
    if (hotel && hotel.picture_url) {
      window.open(hotel.picture_url, "_blank"); // Opens the image in a new tab
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Hotel Management</h2>

      {/* Error Message */}
      {errorMessage && (
        <Alert variant="danger" className="text-center mb-3">
          {errorMessage}
        </Alert>
      )}

      {/* Add Hotel Button */}
      <div className="d-flex justify-content-start mb-3">
        <Button
          onClick={() => handleShowModal({ hotel_name: "", city: "", room_type: "", price: "", amenities: "", number_of_rooms: "", availability: true, id: null })}
          variant="primary"
        >
          Add Hotel
        </Button>
      </div>

      {/* Hotel Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>City</th>
            <th>Room Type</th>
            <th>Price</th>
            <th>Availability</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {hotels.length > 0 ? (
            hotels.map((hotel) => (
              <tr key={hotel.hotel_id}>
                <td>{hotel.hotel_id}</td>
                <td>{hotel.hotel_name}</td>
                <td>{hotel.city_name}</td>
                <td>{hotel.room_type}</td>
                <td>{hotel.price}</td>
                <td>{hotel.availability ? "Available" : "Not Available"}</td>
                <td>
                {hotel.picture_url && (
                      <Button
                        variant="info"
                        onClick={() => window.open(hotel.picture_url, "_blank")}
                      >
                        View Image
                      </Button>
                    )}
                  <Button variant="warning" onClick={() => handleShowModal(hotel)}>
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      setHotelToDelete(hotel.hotel_id);
                      setShowConfirmDeleteModal(true);
                    }}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSelectedHotelId(hotel.hotel_id);
                      document.getElementById("imageUpload").click();
                    }}
                  >
                    {hotel.picture_url ? "Update Image" : "Upload Image"}
                  </Button>
                  <input
                    type="file"
                    id="imageUpload"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No hotels available
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal for Adding/Editing Hotel */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalData.id ? "Edit Hotel" : "Add Hotel"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="hotelName">
              <Form.Label>Hotel Name</Form.Label>
              <Form.Control
                type="text"
                value={modalData.hotel_name}
                onChange={(e) => setModalData({ ...modalData, hotel_name: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="city">
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

            <Form.Group controlId="roomType">
              <Form.Label>Room Type</Form.Label>
              <Form.Control
                type="text"
                value={modalData.room_type}
                onChange={(e) => setModalData({ ...modalData, room_type: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={modalData.price}
                onChange={(e) => setModalData({ ...modalData, price: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="amenities">
              <Form.Label>Amenities</Form.Label>
              <Form.Control
                type="text"
                value={modalData.amenities}
                onChange={(e) => setModalData({ ...modalData, amenities: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="numberOfRooms">
              <Form.Label>Number of Rooms</Form.Label>
              <Form.Control
                type="number"
                value={modalData.number_of_rooms}
                onChange={(e) => setModalData({ ...modalData, number_of_rooms: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="availability">
              <Form.Label>Availability</Form.Label>
              <Form.Check
                type="checkbox"
                checked={modalData.availability}
                onChange={(e) => setModalData({ ...modalData, availability: e.target.checked })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveHotel}>
            Save Hotel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal show={showConfirmDeleteModal} onHide={() => setShowConfirmDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this hotel?
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
    </Container>
  );
};

export default AdminHotels;
