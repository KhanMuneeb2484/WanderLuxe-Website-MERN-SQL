import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function HotelPage() {
  const { cityId } = useParams(); // Get cityId from the URL
  const [hotels, setHotels] = useState([]);
  const [cityName, setCityName] = useState(""); // State to store the city name
  const [error, setError] = useState(null); // To store any error message

  const bearerToken = localStorage.getItem("token"); // Retrieve token from localStorage

  useEffect(() => {
    // Fetch city name based on the cityId
    const fetchCityName = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/cities/get-city-by-id/${cityId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${bearerToken}`, // Add Bearer token
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch city name");
        }

        const data = await response.json();
        setCityName(data.city_name); // Set the city name to state
      } catch (error) {
        setError(error.message);
        console.error("Error fetching city name:", error);
      }
    };

    // Fetch hotels based on the cityId
    const fetchHotels = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/hotels/get-hotels-by-cityId/${cityId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${bearerToken}`, // Add Bearer token
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch hotels");
        }

        const data = await response.json();
        setHotels(data); // Set the hotels data to state
      } catch (error) {
        setError(error.message);
        console.error("Error fetching hotels:", error);
      }
    };

    fetchCityName(); // Fetch the city name
    fetchHotels(); // Fetch the hotels
  }, [cityId, bearerToken]); // Dependency array includes cityId and token to re-fetch if they change

  return (
    <div>
      {/* Hero Header */}
      <div className="container-fluid bg-primary py-5 mb-5 hero-header">
        <div className="container py-5">
          <div className="row justify-content-center py-5">
            <div className="col-lg-10 pt-lg-5 mt-lg-5 text-center">
              <h1 className="display-3 text-white animated slideInDown">
                Hotels in {cityName || "City"} {/* Show city name or a placeholder */}
              </h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-center">
                  <li className="breadcrumb-item">
                    <a href="/">Home</a>
                  </li>
                  <li
                    className="breadcrumb-item text-white active"
                    aria-current="page"
                  >
                    Hotels
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Hotels Section */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
            <h6 className="section-title bg-white text-center text-primary px-3">
              Hotels
            </h6>
            <h1 className="mb-5">Explore Hotels in {cityName}</h1>
          </div>
          {error && <p className="text-center text-danger">{error}</p>} {/* Display error if any */}
          <div className="row g-4 justify-content-center">
            {hotels.map((hotel) => (
              <div
                key={hotel.hotel_id}
                className="col-lg-4 col-md-6 wow fadeInUp"
                data-wow-delay="0.1s"
              >
                <div className="destination-item card" style={{ cursor: "pointer" }}>
                  <div className="overflow-hidden">
                    {/* Placeholder image, replace it with dynamic images later */}
                    <img
                      className="img-fluid card-img-top"
                      src="placeholder-hotel.jpeg"
                      alt={hotel.hotel_name}
                    />
                  </div>
                  <div className="text-center p-4">
                    <h3 className="mb-3">{hotel.hotel_name}</h3>
                    <p className="mb-2"><strong>Room Type:</strong> {hotel.room_type}</p>
                    <p className="mb-2"><strong>Price:</strong> ${hotel.price} per night</p>
                    <p className="mb-2"><strong>Amenities:</strong> {hotel.amenities}</p>
                    <p className="mb-2">
                      <strong>Availability:</strong>{" "}
                      {hotel.availability ? "Available" : "Not Available"}
                    </p>
                    <p className="mb-2"><strong>Rooms Available:</strong> {hotel.number_of_rooms}</p>
                    <a
                      href={`/book-hotel/${hotel.hotel_id}`}
                      className="btn btn-sm btn-primary"
                      style={{ borderRadius: "30px" }}
                    >
                      Book Now
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HotelPage;
