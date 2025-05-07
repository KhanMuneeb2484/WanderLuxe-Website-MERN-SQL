import React, { useState, useContext } from "react";
import { useNavigate ,useLocation} from "react-router-dom";
import { Form, Button, Container, Alert, Card } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

const API_URL = "http://localhost:3000/api/users/login-user"; // Replace with your actual API URL

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  

  // Handle input field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Reset error message before each attempt

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("API Response:", data); // Debugging the full response

        const userData = {
          user_id: data.user.user_id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          token: data.token,
        };

        login(userData); // Save user data in context

        // Navigate based on user role
        const redirectTo = location.state?.from || (userData.role === "admin" ? "/AdminHome" : "/");
        navigate(redirectTo);

      } else {
        const error = await response.json();
        setErrorMessage(error.message || "Invalid email or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <Container className=" py-5 mt-5 d-flex justify-content-center">
      <Card
        className="p-5 shadow-lg"
        style={{ maxWidth: "400px", width: "100%", marginTop: "50px", marginBottom: "50px" }}
      >
        <h2 className="text-center mb-4">Login</h2>

        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="email" className="mb-4">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email"
              required
            />
          </Form.Group>

          <Form.Group controlId="password" className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter password"
              required
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100">
            Login
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Login;
