import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const AdminHome = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    if (decodedToken.role !== "admin") {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="container mt-5">
      <h2 className="text-center mt-5 pt-5">Welcome to Admin Dashboard</h2>
      {/* Content for the admin dashboard can be added here */}
    </div>
  );
};

export default AdminHome;
