import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { BookingConfirmationDialog } from "../../components/booking-confirmation-dialog";


const BookingPage = () => {
    const { packageId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(AuthContext);
    const token = localStorage.getItem("token");
    
    const [packageDetails, setPackageDetails] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [totalDays, setTotalDays] = useState(0);
    const [endDate, setEndDate] = useState("");
    const [isCustomPackage, setIsCustomPackage] = useState(false);
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);


    // Get current date and set minimum date to today
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const fetchPackageDetails = async () => {
            setLoading(true);
            try {
                // Check if we're dealing with a custom or pre-made package
                const isCustom = location.state?.isCustomPackage || false;
                setIsCustomPackage(isCustom);
                
                // Fetch package details from API
                const endpoint = isCustom 
                    ? `http://localhost:3000/api/packages/get-package-by-id/${packageId}`
                    : `http://localhost:3000/api/adminPackages/get-package-by-id/${packageId}`;
                
                const response = await fetch(endpoint, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    
                    // If the API is for admin packages, use the [0] index to access the data
                    const packageData = endpoint.includes('adminPackages')
                        ? data.adminPackages[0]  // Use [0] to get the first package from adminPackages
                        : data.package || data;  // For non-admin packages, use the data directly
                    
                    setPackageDetails(packageData);
                    
                    // Calculate total days stayed - handle both direct access and via cities array
                    let days = 0;
                    if (packageData.total_days_stayed) {
                        // If the API directly returns total days
                        days = packageData.total_days_stayed;
                    } else if (packageData.cities && Array.isArray(packageData.cities)) {
                        // If we need to calculate from cities array
                        days = packageData.cities.reduce((total, city) => total + (city.days_stayed || 0), 0);
                    }
                    setTotalDays(days);
                } else {
                    setError("Failed to fetch package details");
                }
            } catch (error) {
                console.error("Error fetching package details:", error);
                setError("Error loading package details. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (packageId) {
            fetchPackageDetails();
        }
    }, [packageId, location.state]);
    // Calculate and update end date when start date changes
    useEffect(() => {
        if (startDate && totalDays > 0) {
            const start = new Date(startDate);
            const end = new Date(start);
            end.setDate(start.getDate() + totalDays);
            setEndDate(end.toISOString().split('T')[0]);
        }
    }, [startDate, totalDays]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!startDate) {
            setError("Please select a start date");
            return;
        }

        if (!token) {
            setError("You must be logged in to book a package");
            return;
        }

        try {
            // Determine which endpoint to use based on package type
            const endpoint = isCustomPackage
                ? "http://localhost:3000/api/customBookings/create-booking"
                : "http://localhost:3000/api/bookings/create-booking";

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    package_id: packageId,
                    start_date: startDate
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setSuccess("Booking created successfully!");
                setShowConfirmationDialog(true); // Show the confirmation dialog instead of setTimeout/redirect

            } else {
                const errorData = await response.json();
                setError(errorData.message || "Failed to create booking");
            }
        } catch (error) {
            console.error("Error creating booking:", error);
            setError("Error creating booking. Please try again.");
        }
    };
    const handleCloseDialog = () => {
        setShowConfirmationDialog(false);
    };
    const handleViewBookings = () => {
        navigate("/profile");
    };

    if (loading) {
        return (
            <div className="container mt-5 pt-5">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="container-fluid bg-primary py-5 mb-5 hero-header">
                <div className="container py-5">
                    <div className="row justify-content-center py-5">
                        <div className="col-lg-10 pt-lg-5 mt-lg-5 text-center">
                            <h1 className="display-3 text-white animated slideInDown">
                                Book Your Package
                            </h1>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb justify-content-center">
                                    <li className="breadcrumb-item">
                                        <a href="/">Home</a>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <a href="/packages">Packages</a>
                                    </li>
                                    <li
                                        className="breadcrumb-item text-white active"
                                        aria-current="page"
                                    >
                                        Booking
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container py-5">
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}
                
                {success && !showConfirmationDialog &&(
                    <div className="alert alert-success" role="alert">
                        {success}
                    </div>
                )}

                {packageDetails && (
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="card mb-4 shadow-sm">
                                <div className="card-body">
                                    <h3 className="card-title mb-4">Package Details</h3>
                                    
                                    <div className="mb-3">
                                        <h5>Country: {packageDetails.country_name}</h5>
                                        <h6>Guide: {packageDetails.guide_name || 'Not specified'}</h6>
                                        <p>
                                            <strong>Total Price:</strong> ${packageDetails.total_price}<br/>
                                            <strong>Total Duration:</strong> {totalDays} days<br/>
                                            <strong>Number of People:</strong> {packageDetails.num_people || 1}
                                        </p>
                                    </div>

                                    {packageDetails.cities && Array.isArray(packageDetails.cities) && packageDetails.cities.length > 0 ? (
                                        <div className="mb-3">
                                            <h5>Cities:</h5>
                                            <ul className="list-group">
                                                {packageDetails.cities.map((city) => (
                                                    <li key={city.city_id || city.package_city_id} className="list-group-item">
                                                        <h6>{city.city_name} ({city.days_stayed} days)</h6>
                                                        
                                                        {city.locations && Array.isArray(city.locations) && city.locations.length > 0 && (
                                                            <div className="mb-2">
                                                                <strong>Locations:</strong>
                                                                <ul>
                                                                    {city.locations.map((location) => (
                                                                        <li key={location.location_id}>
                                                                            {location.location_name} - ${location.location_price}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                        
                                                        {city.hotels && Array.isArray(city.hotels) && city.hotels.length > 0 && (
                                                            <div>
                                                                <strong>Hotels:</strong>
                                                                <ul>
                                                                    {city.hotels.map((hotel) => (
                                                                        <li key={hotel.hotel_id}>
                                                                            {hotel.hotel_name} - ${hotel.hotel_cost}
                                                                            {hotel.num_rooms && ` (${hotel.num_rooms} room${hotel.num_rooms > 1 ? 's' : ''})`}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : (
                                        <div className="alert alert-info">
                                            No detailed city information available for this package.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h3 className="card-title mb-4">Book Now</h3>
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="startDate" className="form-label">Start Date</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                id="startDate"
                                                min={today}
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                required
                                            />
                                        </div>

                                        {endDate && (
                                            <div className="mb-3">
                                                <label className="form-label">End Date (Estimated)</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    value={endDate}
                                                    disabled
                                                />
                                                <small className="text-muted">
                                                    Your trip will end on this date based on the package duration.
                                                </small>
                                            </div>
                                        )}

                                        <div className="mb-3">
                                            <label className="form-label">Total Duration</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={`${totalDays} days`}
                                                disabled
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Total Price</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={`$${packageDetails.total_price}`}
                                                disabled
                                            />
                                        </div>

                                        {!token && (
                                            <div className="alert alert-warning">
                                                Please <a href="/login">log in</a> to book this package.
                                            </div>
                                        )}

                                        <button 
                                            type="submit" 
                                            className="btn btn-primary w-100"
                                            disabled={!token}
                                        >
                                            Pay Now
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* Booking Confirmation Dialog */}
                <BookingConfirmationDialog 
                    open={showConfirmationDialog}
                    onClose={handleCloseDialog}
                    onViewBookings={handleViewBookings}
                />
            </div>
        </>
    );
};

export default BookingPage;