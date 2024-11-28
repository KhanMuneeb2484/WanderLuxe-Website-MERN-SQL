import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/User/UserHome";
import About from "./pages/User/UserAbout";
import Services from "./pages/User/UserServices";
import Packages from "./pages/User/UserPackages";
import Destination from "./pages/User/UserDestination";
import Booking from "./pages/User/Booking";
import Login from "./pages/Login";
import Contact from "./pages/User/UserContact";
import Dashboard from "./pages/User/UserDashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import Admin from "./pages/Admin/Admin";
import Users from "./pages/Admin/Users";
import Acountries from "./pages/Admin/Acountries";

export default function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/destination" element={<Destination />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/admin" element={<Admin />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/acountries" element={<Acountries />} />
      </Routes>
      <Footer />
    </div>
  );
}
