import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { AuthContext } from "../../context/AuthContext"; // Corrected path
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Card,
  Image,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const API_URL_UPDATE = "http://localhost:3000/api/users/update-user";
const API_URL_GET_USER = "http://localhost:3000/api/users/get-user";
const API_URL_UPDATE_PICTURE = "http://localhost:3000/api/users/update-picture";

const UserDashboard = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUserData(token);
  }, []);

  const fetchUserData = async (token) => {
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
        setFormData({ name: data.name, email: data.email });
        setProfilePicture(data.profilePicture);
      } else {
        logout();
        navigate("/login");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      navigate("/login");
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
      const response = await fetch(API_URL_UPDATE, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setUserData(data);
        setIsEditing(false);
      } else {
        console.error("Failed to update profile:", data.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profilePicture", file);

      const token = localStorage.getItem("token");
      try {
        const response = await fetch(API_URL_UPDATE_PICTURE, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        const data = await response.json();
        if (response.ok) {
          setProfilePicture(data.profilePicture);
        } else {
          console.error("Failed to update profile picture:", data.message);
        }
      } catch (error) {
        console.error("Error updating profile picture:", error);
      }
    }
  };

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="p-4 shadow">
            <div className="text-center mb-4">
              <Image
                src={profilePicture || "/default-profile.png"}
                alt="Profile"
                roundedCircle
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
              <h2 className="mt-3">{userData.name}</h2>
              <p>{userData.email}</p>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Update Profile Picture</Form.Label>
                <Form.Control
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </Form.Group>
            </div>
            <h4>Booking Details</h4>
            <p>No booking details available.</p>
            <Button
              variant="primary"
              className="mt-3"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
            {isEditing && (
              <Form className="mt-4">
                <Form.Group controlId="formName" className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Button variant="primary" onClick={handleUpdateProfile}>
                  Save Changes
                </Button>
              </Form>
            )}
            <Button variant="secondary" className="mt-3" onClick={logout}>
              Logout
            </Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserDashboard;
