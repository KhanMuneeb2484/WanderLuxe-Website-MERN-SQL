import React, { useEffect, useState, useContext } from "react";
import { Table, Button, Container, Alert, Modal } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null); // Store the user ID to delete
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
        console.log("Fetched users:", data);
        setUsers(data); // Update with the actual array returned
      } else {
        const errorText = await response.text();
        setErrorMessage(errorText || "Failed to fetch users.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const deleteUser = async () => {
    if (!userToDelete) return;
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:3000/api/users/delete-user/${userToDelete}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        setUsers(users.filter((user) => user.user_id !== userToDelete));
        setShowDeleteConfirm(false); // Close the modal after deletion
      } else {
        const errorText = await response.text();
        setErrorMessage(errorText || "Failed to delete user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const handleShowDeleteConfirm = (userId) => {
    setUserToDelete(userId);
    setShowDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setUserToDelete(null);
  };

  return (
    <Container className="mt-5">
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
              <tr key={user.user_id}>
                <td>{user.user_id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone_number}</td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => handleShowDeleteConfirm(user.user_id)}
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

      {/* Confirmation Modal for Deletion */}
      <Modal show={showDeleteConfirm} onHide={handleCloseDeleteConfirm}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this user? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteConfirm}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteUser}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Users;
