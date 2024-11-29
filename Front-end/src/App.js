import React, { useContext }  from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import UserHeader from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/User/UserHome";
import About from "./pages/User/UserAbout";
import Services from "./pages/User/UserServices";
import Packages from "./pages/User/UserPackages";
// import Destination from "./pages/User/UserDestination";
import Booking from "./pages/User/UserBookings";
import { AuthContext } from "./context/AuthContext";

import Login from "./pages/Login";
import Contact from "./pages/User/UserContact";
import Dashboard from "./pages/User/UserDashboard";
import Cities from "./pages/User/UserCities";
import Countries from "./pages/User/UserCountries";
import UserBookings from "./pages/User/UserBookings";
import AdminHeader from "./components/Adminheader";

import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const { user, isAdmin } = useContext(AuthContext);
  return (
    
    <div>
       <UserHeader /> {/* Use UserHeader for all users */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/cities" element={<Cities />} />
        <Route path="/countries" element={<Countries />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/services" element={<Services />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Booking" element={<UserBookings />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;