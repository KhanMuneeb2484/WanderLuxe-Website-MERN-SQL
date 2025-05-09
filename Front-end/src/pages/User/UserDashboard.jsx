import React, { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Container, Row, Col, Button, Form, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const API_URL_UPDATE = "http://localhost:3000/api/users/update-user";
const API_URL_GET_USER = "http://localhost:3000/api/users/get-user";
const API_URL_NORMAL_BOOKINGS = "http://localhost:3000/api/bookings/user-bookings";
const API_URL_CUSTOM_BOOKINGS = "http://localhost:3000/api/customBookings/user-bookings";

const UserDashboard = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone_number: "" });
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userBookings, setUserBookings] = useState({ normalBookings: [], customBookings: [] });

  const fetchUserData = useCallback(async (token) => {
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
  }, [logout, navigate]);

  const fetchUserBookings = useCallback(async (token) => {
    try {
      const [normalRes, customRes] = await Promise.all([
        fetch(API_URL_NORMAL_BOOKINGS, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(API_URL_CUSTOM_BOOKINGS, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const normalData = await normalRes.json();
      const customData = await customRes.json();

      // Debugging line to check the combined data before setting the state
      console.log('Combined Bookings Data:', { normalBookings: normalData.bookings, customBookings: customData.bookings });

      setUserBookings({
        normalBookings: Array.isArray(normalData.bookings) ? normalData.bookings : [],
        customBookings: Array.isArray(customData.bookings) ? customData.bookings : [],
      });

    } catch (error) {
      console.error("Error fetching bookings:", error);
      setErrorMessage("Unable to fetch bookings. Please try again.");
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetchUserData(token);
    fetchUserBookings(token);
  }, [navigate, fetchUserData, fetchUserBookings]);

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
                    {userBookings.normalBookings.length === 0 && userBookings.customBookings.length === 0 ? (
                      <p className="mb-0 text-center text-muted">No booking details available at this moment.</p>
                    ) : (
                      <>
                        {userBookings.normalBookings.map((booking) => (
                          <Card key={`normal-${booking.booking_id}`} className="mb-3">
                            <Card.Body>
                              <strong>Type:</strong> Normal<br />
                              <strong>Package:</strong> {booking.admin_package_id}<br />
                              <strong>Start:</strong> {new Date(booking.start_date).toLocaleDateString()}<br />
                              <strong>End:</strong> {new Date(booking.end_date).toLocaleDateString()}<br />
                              <strong>Status:</strong> {booking.status}
                            </Card.Body>
                          </Card>
                        ))}

                        {userBookings.customBookings.map((booking) => (
                          <Card key={`custom-${booking.booking_id}`} className="mb-3">
                            <Card.Body>
                              <strong>Type:</strong> Custom<br />
                              <strong>Package:</strong> {booking.package_name || booking.package_id}<br />
                              <strong>Start:</strong> {new Date(booking.start_date).toLocaleDateString()}<br />
                              <strong>End:</strong> {new Date(booking.end_date).toLocaleDateString()}<br />
                              <strong>Status:</strong> {booking.status}
                            </Card.Body>
                          </Card>
                        ))}
                      </>
                    )}
                  </div>

                  <div className="d-flex gap-2 mt-4">
                    <Button variant="outline-primary" className="px-4" onClick={() => setIsEditing(true)}>
                      <i className="bi bi-pencil me-2"></i>
                      Edit Profile
                    </Button>
                    <Button variant="outline-danger" className="px-4" onClick={logout}>
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
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        disabled
                      />
                    </Form.Group>

                    <Form.Group controlId="formPhone" className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                      />
                    </Form.Group>

                    <Button variant="primary" className="w-100" onClick={handleUpdateProfile}>
                      Update Profile
                    </Button>
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
