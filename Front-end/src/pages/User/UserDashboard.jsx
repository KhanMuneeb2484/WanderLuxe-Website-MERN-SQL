import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Container, Row, Col, Button, Form, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const API_URL_UPDATE = "http://localhost:3000/api/users/update-user";
const API_URL_GET_USER = "http://localhost:3000/api/users/get-user";

const UserDashboard = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone_number: "" });
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUserData(token);
  }, [navigate]);

  const fetchUserData = async (token) => {
    setLoading(true);
    try {
      const response = await fetch(API_URL_GET_USER, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUserData(data);
        setFormData({ name: data.name, email: data.email, phone_number: data.phone_number });
      } else {
        setErrorMessage("Session expired. Please login again.");
        logout();
        navigate("/login");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setErrorMessage("Unable to load your profile. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdateProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      // Remove email from the data being sent to the API
      const { email, ...dataToUpdate } = formData;
      
      const response = await fetch(API_URL_UPDATE, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToUpdate),
      });

      const data = await response.json();

      if (response.ok) {
        setUserData(data);
        setIsEditing(false);
        setSuccessMessage("Profile updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage(data.message || "Failed to update profile");
        setTimeout(() => setErrorMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage("Something went wrong. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading your profile...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5 mt-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          {successMessage && (
            <Alert variant="success" className="mb-4">
              {successMessage}
            </Alert>
          )}
          {errorMessage && (
            <Alert variant="danger" className="mb-4">
              {errorMessage}
            </Alert>
          )}
          
          <Card className="border-0 shadow-lg">
            <Card.Header className="bg-primary text-white p-4">
              <h3 className="mb-0">User Dashboard</h3>
            </Card.Header>
            
            <Card.Body className="p-4">
              {!isEditing ? (
                <div>
                  <div className="d-flex align-items-center mb-4">
                    <div className="bg-light rounded-circle p-3 me-3">
                      <i className="bi bi-person fs-3"></i>
                    </div>
                    <div>
                      <h4 className="mb-1">{userData.name}</h4>
                      <p className="text-muted mb-0">{userData.email}</p>
                      <p className="text-muted mb-0">{userData.phone_number || "No phone number added"}</p>
                    </div>
                  </div>
                  
                  <hr className="my-4" />
                  
                  <div className="mb-4">
                    <h5 className="text-primary mb-3">
                      <i className="bi bi-calendar-check me-2"></i>
                      Your Bookings
                    </h5>
                    <Card className="bg-light border-0">
                      <Card.Body className="p-3">
                        <p className="mb-0 text-center text-muted">No booking details available at this moment.</p>
                      </Card.Body>
                    </Card>
                  </div>
                  
                  <div className="d-flex gap-2 mt-4">
                    <Button 
                      variant="outline-primary" 
                      className="px-4" 
                      onClick={() => setIsEditing(true)}
                    >
                      <i className="bi bi-pencil me-2"></i>
                      Edit Profile
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      className="px-4" 
                      onClick={logout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Logout
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <h5 className="mb-4">Edit Your Profile</h5>
                  <Form>
                    <Form.Group controlId="formName" className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your name"
                      />
                    </Form.Group>

                    <Form.Group controlId="formEmail" className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="bg-light"
                      />
                      <Form.Text className="text-muted">
                        Email address cannot be changed
                      </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formPhone" className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                      />
                    </Form.Group>

                    <div className="d-flex gap-2 mt-4">
                      <Button 
                        variant="primary" 
                        onClick={handleUpdateProfile}
                      >
                        Save Changes
                      </Button>
                      <Button 
                        variant="light" 
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({ 
                            name: userData.name, 
                            email: userData.email, 
                            phone_number: userData.phone_number 
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Form>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserDashboard;