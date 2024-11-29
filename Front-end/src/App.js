import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import UserHeader from "./components/Header";
import AdminHeader from "./components/Adminheader";
import Footer from "./components/Footer";
import Home from "./pages/User/UserHome";
import About from "./pages/User/UserAbout";
import Services from "./pages/User/UserServices";
import Packages from "./pages/User/UserPackages";
// import Destination from "./pages/User/UserDestination";
import Booking from "./pages/User/UserBookings";
import Login from "./pages/Login";
import Contact from "./pages/User/UserContact";
import Dashboard from "./pages/User/UserDashboard";
import Cities from "./pages/User/UserCities";
import Countries from "./pages/User/UserCountries";
import UserBookings from "./pages/User/UserBookings";
import AdminHome from "./pages/Admin/AdminHome";
import AdminBookings from "./pages/Admin/AdminBookings";
import AdminCities from "./pages/Admin/AdminCities";
import AdminCountries from "./pages/Admin/AdminCountries";
import AdminHotels from "./pages/Admin/AdminHotels";
import AdminPackages from "./pages/Admin/AdminPackages";
import AdminTourguides from "./pages/Admin/AdminTourguides";
import AdminUsers from "./pages/Admin/AdminUsers";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const { user, isAdmin } = useContext(AuthContext);

  return (
    <div>
      <AdminHeader /> 
      <UserHeader/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/cities" element={<Cities />} />
        <Route path="/countries" element={<Countries />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/services" element={<Services />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={user && !isAdmin ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/bookings"
          element={user && !isAdmin ? <UserBookings /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin"
          element={user && isAdmin ? <AdminHome /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/bookings"
          element={user && isAdmin ? <AdminBookings /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/cities"
          element={user && isAdmin ? <AdminCities /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/countries"
          element={user && isAdmin ? <AdminCountries /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/hotels"
          element={user && isAdmin ? <AdminHotels /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/packages"
          element={user && isAdmin ? <AdminPackages /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/tourguides"
          element={user && isAdmin ? <AdminTourguides /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/users"
          element={user && isAdmin ? <AdminUsers /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
