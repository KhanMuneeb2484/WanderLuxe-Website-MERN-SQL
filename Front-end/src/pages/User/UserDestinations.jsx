import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import { Link } from "react-router-dom";

function Destinations() {
    // State to store fetched destinations
    const [countries, setCountries] = useState([]);
    const [error, setError] = useState(null); // To store any error that occurs

    // Retrieve the token from localStorage
    const bearerToken = localStorage.getItem("token");
    console.log(bearerToken);
    // Use navigate for programmatic navigation
    const navigate = useNavigate();

    // Fetch countries data from API
    useEffect(() => {
        const fetchCountries = async () => {
            if (!bearerToken) {
                setError("No token found. Please log in.");
                return; // Exit early if no token is found
            }

            try {
                const response = await fetch(
                    "http://localhost:3000/api/countries/get-all-countries",
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${bearerToken}`, // Send the Bearer token
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch countries");
                }

                const data = await response.json();
                console.log(data);
                setCountries(data); // Set the countries data to state
            } catch (error) {
                setError(error.message); // Set the error message if something goes wrong
                console.error("Error fetching countries:", error);
            }
        };

        fetchCountries(); // Call the function to fetch countries
    }, [bearerToken]); // Dependency array includes bearerToken to re-fetch if token changes

    // Handle click on the country card
    const handleCountryClick = (countryId) => {
        // Navigate to the cities page with the corresponding country id
        navigate(`/cities/${countryId}`);
    };

    return (
        <div>
            <div className="container-fluid bg-primary py-5 mb-5 hero-header">
                <div className="container py-5">
                    <div className="row justify-content-center py-5">
                        <div className="col-lg-10 pt-lg-5 mt-lg-5 text-center">
                            <h1 className="display-3 text-white animated slideInDown">
                                Destinations
                            </h1>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb justify-content-center">
                                    <li className="breadcrumb-item">
                                        <a href="/">Home</a>
                                    </li>
                                    <li
                                        className="breadcrumb-item text-white active"
                                        aria-current="page">
                                        Destinations
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-xxl py-5">
                <div className="container">
                    <div
                        className="text-center wow fadeInUp"
                        data-wow-delay="0.1s">
                        <h6 className="section-title bg-white text-center text-primary px-3">
                            Destinations
                        </h6>
                        <h1 className="mb-5">The Destinations We Offer:</h1>
                    </div>
                    <div className="row g-4 justify-content-center">
                        {error && (
                            <p className="text-center text-danger">{error}</p>
                        )}{" "}
                        {/* Display error if any */}
                        {countries.map((country) => (
                            <div
                                key={country.country_id}
                                className="col-lg-4 col-md-6 wow fadeInUp"
                                data-wow-delay="0.1s"
                                // onClick={() =>
                                //     handleCountryClick(country.country_id)
                                // } // Handle the card click
                            >
                                <div
                                    className="destination-item card"
                                    style={{ cursor: "pointer" }}>
                                    <div className="overflow-hidden">
                                        {/* Placeholder image, replace it with dynamic images later */}
                                        <img
                                            className="img-fluid card-img-top"
                                            src={country.picture-url}
                                            alt={country.country_name}
                                        />
                                    </div>
                                    <div className="text-center p-4">
                                        <h3 className="mb-3">
                                            {country.country_name}
                                        </h3>
                                        <Link
                                            to={`/cities/${country.country_id}`}
                                            className="btn btn-sm btn-primary mb-2"
                                            style={{ borderRadius: "30px" }}>
                                            Explore Cities
                                        </Link>
                                        <br />
                                        <Link
                                            to={`/guides/${country.country_id}`}
                                            className="btn btn-sm btn-primary"
                                            style={{ borderRadius: "30px" }}>
                                            Meet the Guides
                                        </Link>
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

export default Destinations;
