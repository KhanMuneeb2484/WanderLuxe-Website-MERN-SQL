import React, { useState, useContext, useEffect } from "react";
import { Button, Form, Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:3000/api/users/login-user";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, logout, isAuthenticated } = useContext(AuthContext); // Get login, logout, and isAuthenticated from AuthContext
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/"); // Redirect to homepage if already logged in
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

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
        const token = data.token;
        const decodedToken = jwtDecode(token);
        const userData = {
          email: decodedToken.email,
          role: decodedToken.role,
          profilePicture: "/default-profile.png",
        };
        login(userData); // Save user data and token
        localStorage.setItem("token", token); // Store token in localStorage
        navigate(decodedToken.role === "admin" ? "/admin/admin" : "/"); // Redirect to appropriate page
      } else {
        const errorText = await response.text();
        setErrorMessage(
          errorText || "Invalid email or password. Please try again."
        );
      }
    } catch (error) {
      console.error("Error occurred during login:", error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      logout(); // Log out the user when the page is refreshed or closed
      localStorage.removeItem("token"); // Remove token from localStorage on logout
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [logout]);

  return (
    <Container className="mt-5" style={{ maxWidth: "500px" }}>
      <h2 className="mb-4 text-center">Login</h2>
      {errorMessage && (
        <Alert variant="danger" className="text-center">
          {errorMessage}
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email" className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
          />
        </Form.Group>
        <Form.Group controlId="password" className="mb-4">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
          />
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          className="w-100"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </Form>
    </Container>
  );
};

export default Login;
