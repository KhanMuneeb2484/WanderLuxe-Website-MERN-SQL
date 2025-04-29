import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import UserHeader from "./components/Header";
import AdminHeader from "./components/Adminheader";
import Footer from "./components/Footer";
import Home from "./pages/User/UserHome";
import About from "./pages/User/UserAbout";
import Services from "./pages/User/UserServices";
import Packages from "./pages/User/UserPackages";
import PackagesAdmin from "./pages/Admin/AdminPackages";
import Booking from "./pages/User/UserBookings";
import { AuthContext } from "./context/AuthContext";
import Destinations from "./pages/User/UserDestinations";
import Login from "./pages/Login";
import Contact from "./pages/User/UserContact";
import Dashboard from "./pages/User/UserDashboard";
import Cities from "./pages/User/UserCities";
import Countries from "./pages/User/UserCountries";
import UserBookings from "./pages/User/UserBookings";
import CityPage from "./pages/User/CityPage";
import GuidePage from "./pages/User/GuidePage";
import LocationPage from "./pages/User/LocationPage";
import PackagePage from "./pages/User/PackagePage";
import AdminCountries  from "./pages/Admin/AdminCountries";
import AdminCities  from "./pages/Admin/AdminCities";
import AdminLocations  from "./pages/Admin/AdminLocations";
import Users  from "./pages/Admin/Users";

import "bootstrap/dist/css/bootstrap.min.css";
import HotelPage from "./pages/User/HotelsPage";
import AdminHotels from "./pages/Admin/AdminHotels";
import AdminGuides from "./pages/Admin/AdminGuides";
import BookingPage from "./pages/User/BookingPage";


const App = () => {
  const { user } = useContext(AuthContext); // Access user context
  return (
    <div>
      {/* Conditionally render AdminHeader or UserHeader */}
      {user?.role === "admin" ? <AdminHeader /> : <UserHeader />}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/cities" element={<Cities />} />
        <Route path="/countries" element={<Countries />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/adminpackages" element={<PackagesAdmin />} />
        <Route path="/packages/:packageId" element={<PackagePage />} />
        <Route path="/services" element={<Services />} />
        <Route path="/Destination" element={<Destinations />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/AdminCountries" element={<AdminCountries />} />
        <Route path="/AdminCities" element={<AdminCities />} />
        <Route path="/AdminLocations" element={<AdminLocations />} />
        <Route path="/AdminGuides" element={<AdminGuides />} />
        <Route path="/AdminHotels" element={<AdminHotels />} />
        <Route path="/Users" element={<Users />} />
        <Route path="/Booking" element={<UserBookings />} />
        <Route path="/cities/:countryId" element={<CityPage />} />
        <Route path="/guides/:countryId" element={<GuidePage />} />
        <Route path="/locations/:cityId" element={<LocationPage />} />
        <Route path="/hotels/:cityId" element={<HotelPage />} />
        <Route path="/booking/:packageId" element={<BookingPage />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
