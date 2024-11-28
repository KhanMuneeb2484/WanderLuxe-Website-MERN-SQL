import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import UserHeader from "./components/Header";
import AdminHeader from "./components/AdminHeader";
import Footer from "./components/Footer";

// User Pages
import UserHome from "./pages/User/UserHome";
import UserAbout from "./pages/User/UserAbout";
import UserCities from "./pages/User/UserCities";
import UserCountries from "./pages/User/UserCountries";
import UserContact from "./pages/User/UserContact";
import UserDashboard from "./pages/User/UserDashboard";
import UserPackages from "./pages/User/UserPackages";
import UserBookings from "./pages/User/UserBookings";
import UserServices from "./pages/User/UserServices";

// Admin Pages
import AdminHome from "./pages/Admin/AdminHome";
import AdminBookings from "./pages/Admin/AdminBookings";
import AdminCities from "./pages/Admin/AdminCities";
import AdminCountries from "./pages/Admin/AdminCountries";
import AdminHotels from "./pages/Admin/AdminHotels";
import AdminPackages from "./pages/Admin/AdminPackages";
import AdminTourguides from "./pages/Admin/AdminTourguides";
import AdminUsers from "./pages/Admin/AdminUsers";

// Auth Pages
import Login from "./pages/Login";

import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const { user, isAdmin } = useContext(AuthContext);

  return (
    <div>
      {isAdmin ? <AdminHeader /> : <UserHeader />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<UserHome />} />
        <Route path="/about" element={<UserAbout />} />
        <Route path="/cities" element={<UserCities />} />
        <Route path="/countries" element={<UserCountries />} />
        <Route path="/contact" element={<UserContact />} />
        <Route path="/packages" element={<UserPackages />} />
        <Route path="/services" element={<UserServices />} />
        <Route path="/login" element={<Login />} /> {/* Added Login route */}
        {/* Protected User Routes */}
        <Route
          path="/dashboard"
          element={
            user && !isAdmin ? <UserDashboard /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/bookings"
          element={
            user && !isAdmin ? <UserBookings /> : <Navigate to="/login" />
          }
        />
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={user && isAdmin ? <AdminHome /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/bookings"
          element={
            user && isAdmin ? <AdminBookings /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/admin/cities"
          element={user && isAdmin ? <AdminCities /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/countries"
          element={
            user && isAdmin ? <AdminCountries /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/admin/hotels"
          element={user && isAdmin ? <AdminHotels /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/packages"
          element={
            user && isAdmin ? <AdminPackages /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/admin/tourguides"
          element={
            user && isAdmin ? <AdminTourguides /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/admin/users"
          element={user && isAdmin ? <AdminUsers /> : <Navigate to="/login" />}
        />
        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />{" "}
        {/* Redirect unknown paths */}
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
