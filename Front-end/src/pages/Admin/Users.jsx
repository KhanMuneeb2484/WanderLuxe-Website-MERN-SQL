import React, { useEffect, useState, useContext } from "react";
import { Table, Button, Container, Alert, Dropdown } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    fetchUsers(token);
  }, []);

  const fetchUsers = async (token) => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/users/get-all-users",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        const errorText = await response.text();
        setErrorMessage(errorText || "Failed to fetch users.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const deleteUser = async (userId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:3000/api/users/delete-user/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        setUsers(users.filter((user) => user.id !== userId));
      } else {
        const errorText = await response.text();
        setErrorMessage(errorText || "Failed to delete user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div>
      {/* Admin Navbar Start */}
      <div className="container-fluid position-relative p-0">
        <nav
          className="navbar navbar-expand-lg fixed-top px-4 py-3"
          style={{ background: "rgba(33, 37, 41, 0.85)" }}
        >
          <Link to="/admin" className="navbar-brand p-0">
            <h1 className="text-white m-0">Admin Panel</h1>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCollapse"
          >
            <span className="fa fa-bars text-white" />
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <div className="navbar-nav ms-auto py-0">
              <Link to="/admin/Admin" className="nav-item nav-link text-white">
                Home
              </Link>
              <Link
                to="/admin/packages"
                className="nav-item nav-link text-white"
              >
                Packages
              </Link>
              <Link
                to="/admin/countries"
                className="nav-item nav-link text-white"
              >
                Countries
              </Link>
              <Link to="/admin/cities" className="nav-item nav-link text-white">
                Cities
              </Link>
              <Link to="/admin/hotels" className="nav-item nav-link text-white">
                Hotels
              </Link>
              <Link
                to="/admin/tour-guides"
                className="nav-item nav-link text-white"
              >
                Tour Guides
              </Link>
              <Link
                to="/admin/locations"
                className="nav-item nav-link text-white"
              >
                Locations
              </Link>
              <Link
                to="/admin/bookings"
                className="nav-item nav-link text-white"
              >
                Bookings
              </Link>
              <Link to="/admin/Users" className="nav-item nav-link text-white">
                Users
              </Link>
            </div>
            <div className="d-flex align-items-center ms-3">
              <Dropdown align="end">
                <Dropdown.Toggle variant="light" id="dropdown-basic">
                  <img
                    src={user?.profilePicture || "/default-profile.png"}
                    alt="Profile"
                    style={{ width: "30px", borderRadius: "50%" }}
                  />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </nav>
      </div>
      {/* Admin Navbar End */}

      <Container className="mt-5 pt-5">
        <h2 className="text-center mb-4">User Management</h2>
        {errorMessage && (
          <Alert variant="danger" className="text-center">
            {errorMessage}
          </Alert>
        )}
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phoneNumber}</td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => deleteUser(user.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default Users;
