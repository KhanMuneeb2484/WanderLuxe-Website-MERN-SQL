import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Packages from "./pages/Packages";
import Destination from "./pages/Destination";
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import Contact from "./pages/Contact";
import "bootstrap/dist/css/bootstrap.min.css";

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
      </Routes>
      <Footer />
    </div>
  );
}