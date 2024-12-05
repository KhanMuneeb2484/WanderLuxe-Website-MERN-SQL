import React, { useEffect, useState, useContext } from "react";
import { Table, Button, Container, Alert, Modal, Form } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";

const AdminGuides = () => {
  const [guides, setGuides] = useState([]);
  const [countries, setCountries] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [modalData, setModalData] = useState({
    name: "",
    country: "",
    expertise: "",
    rating: "",
    charge: "",
    availability: false,
    id: null,
  });
  const [guideToDelete, setGuideToDelete] = useState(null);
  const [image, setImage] = useState(null);
  const [selectedGuideId, setSelectedGuideId] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchGuides(token);
      fetchCountries(token);
    } else {
      setErrorMessage("User not authenticated. Please log in.");
    }
  }, []);

  const fetchGuides = async (token) => {
    try {
      const response = await fetch("http://localhost:3000/api/guides/get-all-guides", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setGuides(data || []);
      } else {
        setErrorMessage("Failed to fetch guides. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching guides:", error);
      setErrorMessage("An error occurred while fetching guides.");
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
      console.error("Error fetching countries:", error);
      setErrorMessage("An error occurred while fetching countries.");
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token || !guideToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/guides/delete-guide/${guideToDelete}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setGuides(guides.filter((guide) => guide.guide_id !== guideToDelete));
        setShowConfirmDeleteModal(false);
      } else {
        setErrorMessage("Failed to delete guide. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting guide:", error);
      setErrorMessage("An error occurred while deleting the guide.");
    }
  };

  const handleShowModal = (guide = { name: "", country: "", expertise: "", rating: "", charge: "", availability: false, id: null }) => {
    setModalData({
      id: guide.guide_id || null,
      name: guide.guide_name || "",
      country: guide.country_id || "",
      expertise: guide.expertise || "",
      rating: guide.rating || "",
      charge: guide.per_day_charge || "",
      availability: guide.availability || false,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalData({ name: "", country: "", expertise: "", rating: "", charge: "", availability: false, id: null });
  };

  const handleSaveGuide = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const method = modalData.id ? "PATCH" : "POST";
    const url = modalData.id
      ? `http://localhost:3000/api/guides/update-guide/${modalData.id}`
      : "http://localhost:3000/api/guides/register-guide";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          guide_name: modalData.name,
          country_id: modalData.country,
          expertise: modalData.expertise,
          rating: modalData.rating,
          per_day_charge: modalData.charge,
          availability: modalData.availability,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (modalData.id) {
          setGuides(
            guides.map((guide) =>
              guide.guide_id === modalData.id
                ? { ...guide, ...modalData }
                : guide
            )
          );
        } else {
          setGuides((prevGuides) => [...prevGuides, data]);
        }
        handleCloseModal();
        fetchGuides(token);
      } else {
        setErrorMessage("Failed to save guide. Please try again.");
      }
    } catch (error) {
      console.error("Error saving guide:", error);
      setErrorMessage("An error occurred while saving the guide.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const handleImageUpload = async () => {
    const token = localStorage.getItem("token");
    if (!token || !selectedGuideId || !image) return;

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch(
        `http://localhost:3000/api/pictures/upload/guide/${selectedGuideId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (response.ok) {
        fetchGuides(token);
        setImage(null); // Clear the selected image
      } else {
        setErrorMessage("Failed to upload image. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setErrorMessage("An error occurred while uploading the image.");
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Guide Management</h2>

      {errorMessage && (
        <Alert variant="danger" className="text-center mb-3">
          {errorMessage}
        </Alert>
      )}

      <div className="d-flex justify-content-start mb-3">
        <Button onClick={() => handleShowModal()} variant="primary">Add Guide</Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Country</th>
            <th>Expertise</th>
            <th>Rating</th>
            <th>Charge</th>
            <th>Availability</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {guides.length > 0 ? (
            guides.map((guide) => (
              <tr key={guide.guide_id}>
                <td>{guide.guide_id}</td>
                <td>{guide.guide_name}</td>
                <td>{guide.country_name}</td>
                <td>{guide.expertise}</td>
                <td>{guide.rating}</td>
                <td>{guide.per_day_charge}</td>
                <td>{guide.availability ? "Available" : "Not Available"}</td>
                <td>
                  <div className="d-flex gap-2">
                    <Button variant="warning" onClick={() => handleShowModal(guide)}>Edit</Button>
                    <Button
                      variant="danger"
                      onClick={() => {
                        setGuideToDelete(guide.guide_id);
                        setShowConfirmDeleteModal(true);
                      }}
                    >
                      Delete
                    </Button>
                    {/* Unified Image Upload Button */}
                    <Button
                      variant={guide.picture_url ? "warning" : "success"}
                      onClick={() => setSelectedGuideId(guide.guide_id)}
                    >
                      {guide.picture_url ? "Update Image" : "Upload Image"}
                    </Button>

                    {/* View Image Button */}
                    {guide.picture_url && (
                      <Button
                        variant="info"
                        onClick={() => window.open(guide.picture_url, "_blank")}
                      >
                        View Image
                      </Button>
                    )}
                    
                  </div>

                  {/* Image Upload Section */}
                  {selectedGuideId === guide.guide_id && (
                    <div className="mt-2">
                      <Form.Group>
                        <Form.Label>Upload New Image</Form.Label>
                        <Form.Control type="file" onChange={handleImageChange} />
                        <Button onClick={handleImageUpload} className="mt-2">
                          Upload Image
                        </Button>
                      </Form.Group>
                    </div>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
                No guides available.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Guide Edit/Add Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalData.id ? "Edit Guide" : "Add Guide"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="guideName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={modalData.name}
                onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="guideCountry">
              <Form.Label>Country</Form.Label>
              <Form.Control
                as="select"
                value={modalData.country}
                onChange={(e) => setModalData({ ...modalData, country: e.target.value })}
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country.country_id} value={country.country_id}>
                    {country.country_name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="guideExpertise">
              <Form.Label>Expertise</Form.Label>
              <Form.Control
                type="text"
                value={modalData.expertise}
                onChange={(e) => setModalData({ ...modalData, expertise: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="guideRating">
              <Form.Label>Rating</Form.Label>
              <Form.Control
                type="number"
                value={modalData.rating}
                onChange={(e) => setModalData({ ...modalData, rating: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="guideCharge">
              <Form.Label>Charge Per Day</Form.Label>
              <Form.Control
                type="number"
                value={modalData.charge}
                onChange={(e) => setModalData({ ...modalData, charge: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="guideAvailability">
              <Form.Check
                type="checkbox"
                label="Available"
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
          <Button variant="primary" onClick={handleSaveGuide}>
            {modalData.id ? "Save Changes" : "Add Guide"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal show={showConfirmDeleteModal} onHide={() => setShowConfirmDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this guide?</Modal.Body>
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

export default AdminGuides;
