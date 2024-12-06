import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

function GuidePage() {
    const { countryId } = useParams(); // Get countryId from the URL
    const [guides, setGuides] = useState([]);
    const [countryName, setCountryName] = useState(""); // State to store the country name
    const [error, setError] = useState(null); // To store any error message

    const bearerToken = localStorage.getItem("token"); // Retrieve token from localStorage

    useEffect(() => {
        // Fetch country name based on the countryId
        const fetchCountryName = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3000/api/countries/get-country-by-id/${countryId}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${bearerToken}`, // Add Bearer token
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch country name");
                }

                const data = await response.json();
                setCountryName(data.country_name); // Set the country name to state
            } catch (error) {
                setError(error.message);
                console.error("Error fetching country name:", error);
            }
        };

        // Fetch guides based on the countryId
        const fetchGuides = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3000/api/guides/get-guides-by-countryId/${countryId}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${bearerToken}`, // Add Bearer token
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch guides");
                }

                const data = await response.json();
                setGuides(data); // Set the guides data to state
            } catch (error) {
                setError(error.message);
                console.error("Error fetching guides:", error);
            }
        };

        fetchCountryName(); // Fetch the country name
        fetchGuides(); // Fetch the guides
    }, [countryId, bearerToken]); // Dependency array includes countryId and token to re-fetch if they change

    return (
        <div>
            {/* Hero Header */}
            <div className="container-fluid bg-primary py-5 mb-5 hero-header">
                <div className="container py-5">
                    <div className="row justify-content-center py-5">
                        <div className="col-lg-10 pt-lg-5 mt-lg-5 text-center">
                            <h1 className="display-3 text-white animated slideInDown">
                                Guides in {countryName}
                            </h1>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb justify-content-center">
                                    <li className="breadcrumb-item">
                                        <a href="/">Home</a>
                                    </li>
                                    <li
                                        className="breadcrumb-item text-white active"
                                        aria-current="page">
                                        Guides
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            {/* Guides Section */}
            <div className="container-xxl py-5">
                <div className="container">
                    <div
                        className="text-center wow fadeInUp"
                        data-wow-delay="0.1s">
                        <h6 className="section-title bg-white text-center text-primary px-3">
                            Guides
                        </h6>
                        <h1 className="mb-5">
                            Explore Guides in {countryName}
                        </h1>
                    </div>
                    {error && (
                        <p className="text-center text-danger">{error}</p>
                    )}{" "}
                    {/* Display error if any */}
                    <div className="row g-4 justify-content-center">
                        {guides.map((guide) => (
                            <div
                                key={guide.guide_id}
                                className="col-lg-4 col-md-6 wow fadeInUp"
                                data-wow-delay="0.1s">
                                <div
                                    className="destination-item card"
                                    style={{ cursor: "pointer" }}>
                                    <div className="overflow-hidden">
                                        {/* Placeholder image, replace it with dynamic images later */}
                                        <img
                                            className="img-fluid card-img-top"
                                            src={guide.picture_url}
                                            alt={guide.country_name}
                                        />
                                    </div>
                                    <div className="text-center p-4">
                                        <h3 className="mb-3">
                                            {guide.guide_name}
                                        </h3>
                                        <p>Expertise: {guide.expertise}</p>
                                        <p>Rating: {guide.rating}</p>
                                        <p>Per Day Charge: ${guide.per_day_charge}</p>
                                        <p>
                                            Availability:{" "}
                                            {guide.availability ? "Available" : "Not Available"}
                                        </p>
                                        
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

export default GuidePage;
