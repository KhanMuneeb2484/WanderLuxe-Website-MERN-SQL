import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import './aboutus.css'


const Packages = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [guides, setGuides] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [cities, setCities] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [locations, setLocations] = useState({});
  const [selectedLocations, setSelectedLocations] = useState({});
  const [hotels, setHotels] = useState({});
  const [selectedHotels, setSelectedHotels] = useState({});
  const [numberOfPersons, setNumberOfPersons] = useState(1);
  const [daysPerCity, setDaysPerCity] = useState({});
  const { user, logout } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("preExisting");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch countries
  const fetchCountries = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:3000/api/countries/get-all-countries`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setCountries(data);
      } else {
        console.error("Failed to fetch countries");
        setErrorMessage("Failed to load countries. Please try again later.");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching countries:", error);
      setErrorMessage("Network error. Please check your connection.");
      setIsLoading(false);
    }
  };

  // Fetch guides for selected country
  const fetchGuides = async (countryId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/guides/get-guides-by-countryId/${countryId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setGuides(data);
      } else {
        console.error("Failed to fetch guides");
        setErrorMessage("Failed to load guides for this country.");
      }
    } catch (error) {
      console.error("Error fetching guides:", error);
      setErrorMessage("Network error while loading guides.");
    }
  };

  // Fetch cities for selected country
  const fetchCities = async (countryId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/cities/get-cities-by-countryId/${countryId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setCities(data);
      } else {
        console.error("Failed to fetch cities");
        setErrorMessage("Failed to load cities for this country.");
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
      setErrorMessage("Network error while loading cities.");
    }
  };

  // Fetch locations for a city
  const fetchLocations = async (cityId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/locations/get-locations-by-cityId/${cityId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setLocations((prev) => ({ ...prev, [cityId]: data }));
      } else {
        console.error(`Failed to fetch locations for city ID ${cityId}`);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  // Fetch hotels for a city
  const fetchHotels = async (cityId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/hotels/get-hotels-by-cityId/${cityId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setHotels((prev) => ({ ...prev, [cityId]: data }));
      } else {
        console.error(`Failed to fetch hotels for city ID ${cityId}`);
      }
    } catch (error) {
      console.error("Error fetching hotels:", error);
    }
  };

  const fetchPackages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "http://localhost:3000/api/adminPackages/get-all-packages/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setPackages(data.adminPackages || []);
      } else {
        console.error("Failed to fetch packages");
        setErrorMessage("Failed to load available packages.");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching packages:", error);
      setErrorMessage("Network error while loading packages.");
      setIsLoading(false);
    }
  };

  // Update data when country is selected
  useEffect(() => {
    if (selectedCountry) {
      fetchGuides(selectedCountry);
      fetchCities(selectedCountry);
      // Reset selections when country changes
      setSelectedGuide(null);
      setSelectedCities([]);
      setSelectedLocations({});
      setSelectedHotels({});
      setDaysPerCity({});
    }
  }, [selectedCountry]);

  // Fetch countries and packages on component load
  useEffect(() => {
    fetchCountries();
    fetchPackages();
  }, []);

  // Handle country change
  const handleCountryChange = (e) => {
    const countryId = e.target.value;
    setSelectedCountry(countryId);
  };

  const handleCitySelection = (cityId, isChecked) => {
    setSelectedCities((prev) =>
      isChecked ? [...prev, cityId] : prev.filter((id) => id !== cityId)
    );
    if (isChecked) {
      fetchLocations(cityId);
      fetchHotels(cityId);
    }
  };

  const handleLocationSelection = (cityId, locationId, isChecked) => {
    setSelectedLocations((prev) => ({
      ...prev,
      [cityId]: isChecked
        ? [...(prev[cityId] || []), locationId]
        : prev[cityId]?.filter((id) => id !== locationId),
    }));
  };

  const handleHotelSelection = (cityId, hotelId, numRooms) => {
    const validNumRooms = numRooms && numRooms > 0 ? numRooms : 1;

    setSelectedHotels((prev) => ({
      ...prev,
      [cityId]: { hotel_id: hotelId, num_rooms: validNumRooms },
    }));
  };

  const handleDaysChange = (cityId, days) => {
    setDaysPerCity((prev) => ({
      ...prev,
      [cityId]: days,
    }));
  };

  // Function to handle booking a pre-made package
  const handleBookPackage = (packageId) => {
    navigate(`/booking/${packageId}`, { state: { isCustomPackage: false } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!selectedCountry) {
      setErrorMessage("Please select a country");
      return;
    }
    
    if (!selectedGuide) {
      setErrorMessage("Please select a guide");
      return;
    }
    
    if (selectedCities.length === 0) {
      setErrorMessage("Please select at least one city");
      return;
    }
    
    // Check if each selected city has hotels and locations
    let valid = true;
    selectedCities.forEach(cityId => {
      if (!selectedHotels[cityId]?.hotel_id) {
        setErrorMessage(`Please select a hotel for all cities`);
        valid = false;
      }
      
      if (!selectedLocations[cityId] || selectedLocations[cityId].length === 0) {
        setErrorMessage(`Please select at least one location for all cities`);
        valid = false;
      }
      
      if (!daysPerCity[cityId] || daysPerCity[cityId] < 1) {
        setErrorMessage(`Please set days to stay for all cities`);
        valid = false;
      }
    });
    
    if (!valid) return;

    setIsLoading(true);
    setErrorMessage("");

    const packageData = {
      country_id: selectedCountry,
      guide_id: selectedGuide,
      num_people: numberOfPersons,
      cities: selectedCities.map((cityId) => ({
        city_id: cityId,
        days_stayed: parseInt(daysPerCity[cityId]) || 1,
        locations: (selectedLocations[cityId] || []).map((locationId) => ({
          location_id: locationId,
        })),
        hotels: [
          {
            hotel_id: selectedHotels[cityId]?.hotel_id || null,
            num_rooms: parseInt(selectedHotels[cityId]?.num_rooms) || 1,
          },
        ],
      })),
    };

    try {
      const response = await fetch(
        "http://localhost:3000/api/packages/create-package",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(packageData),
        }
      );

      setIsLoading(false);

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage("Package created successfully!");
        
        // Navigate to booking page after package creation
        setTimeout(() => {
          navigate(`/booking/${data.package_id}`, {
            state: { isCustomPackage: true },
          });
        }, 1500);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Failed to create package. Please try again.");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error creating package:", error);
      setErrorMessage("Error creating package. Please try again.");
    }
  };

  const renderLocationsList = (cityId) => {
    if (!locations[cityId] || locations[cityId].length === 0) {
      return <p className="text-muted fst-italic">No locations available for this city</p>;
    }
    return (
      <div className="row">
        {locations[cityId].map((location) => (
          <div key={location.location_id} className="col-md-6 mb-2">
            <div className="form-check custom-checkbox">
              <input
                type="checkbox"
                className="form-check-input"
                id={`location-${cityId}-${location.location_id}`}
                checked={selectedLocations[cityId]?.includes(location.location_id) || false}
                onChange={(e) => handleLocationSelection(cityId, location.location_id, e.target.checked)}
              />
              <label className="form-check-label" htmlFor={`location-${cityId}-${location.location_id}`}>
                <div className="d-flex justify-content-between">
                  <span>{location.location_name}</span>
                  <span className="badge bg-info text-dark">${location.location_price}</span>
                </div>
              </label>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderHotelsList = (cityId) => {
    if (!hotels[cityId] || hotels[cityId].length === 0) {
      return <p className="text-muted fst-italic">No hotels available for this city</p>;
    }
    return (
      <div className="hotels-list">
        {hotels[cityId].map((hotel) => (
          <div key={hotel.hotel_id} className="hotel-item card mb-3">
            <div className="card-body">
              <div className="form-check">
                <input
                  type="radio"
                  name={`hotel-${cityId}`}
                  className="form-check-input"
                  id={`hotel-${cityId}-${hotel.hotel_id}`}
                  onChange={() => handleHotelSelection(
                    cityId,
                    hotel.hotel_id,
                    selectedHotels[cityId]?.num_rooms || 1
                  )}
                  checked={selectedHotels[cityId]?.hotel_id === hotel.hotel_id}
                />
                <label className="form-check-label" htmlFor={`hotel-${cityId}-${hotel.hotel_id}`}>
                  <h6 className="mb-1">{hotel.hotel_name}</h6>
                  <div className="d-flex align-items-center">
                    <span className="me-2 text-primary">${hotel.price}/night</span>
                    <div className="hotel-rating">
                      {[...Array(Math.min(5, Math.round(hotel.rating || 3)))].map((_, i) => (
                        <i key={i} className="fa fa-star text-warning"></i>
                      ))}
                    </div>
                  </div>
                </label>
              </div>
              
              {selectedHotels[cityId]?.hotel_id === hotel.hotel_id && (
                <div className="mt-3">
                  <label className="form-label">Number of rooms:</label>
                  <div className="input-group" style={{ maxWidth: "150px" }}>
                    <button 
                      className="btn btn-outline-secondary" 
                      type="button"
                      onClick={() => {
                        const current = selectedHotels[cityId]?.num_rooms || 1;
                        if (current > 1) {
                          handleHotelSelection(cityId, hotel.hotel_id, current - 1);
                        }
                      }}
                    >-</button>
                    <input
                      type="number"
                      min="1"
                      className="form-control text-center"
                      value={selectedHotels[cityId]?.num_rooms || 1}
                      onChange={(e) => {
                        const rooms = parseInt(e.target.value);
                        handleHotelSelection(cityId, hotel.hotel_id, rooms > 0 ? rooms : 1);
                      }}
                    />
                    <button 
                      className="btn btn-outline-secondary" 
                      type="button"
                      onClick={() => {
                        const current = selectedHotels[cityId]?.num_rooms || 1;
                        handleHotelSelection(cityId, hotel.hotel_id, current + 1);
                      }}
                    >+</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Hero Header */}
      <div className="container-fluid bg-primary py-5 mb-5 hero-header position-relative">
        <div className="overlay position-absolute top-0 start-0 w-100 h-100 bg-dark" style={{ opacity: "0.2" }}></div>
        <div className="container py-5 position-relative">
          <div className="row justify-content-center py-5">
            <div className="col-lg-10 pt-lg-5 mt-lg-5 text-center">
              <h1 className="display-3 text-white animated fadeInDown">
                Explore Our Travel Packages
              </h1>
              <p className="lead text-white mb-4 animated fadeInUp">Discover incredible destinations with our carefully curated travel experiences</p>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-center">
                  <li className="breadcrumb-item">
                    <a href="/" className="text-white text-decoration-none">Home</a>
                  </li>
                  <li className="breadcrumb-item text-white active" aria-current="page">
                    Packages
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-5">
        {/* Alerts */}
        {errorMessage && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Error!</strong> {errorMessage}
            <button type="button" className="btn-close" onClick={() => setErrorMessage("")}></button>
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            <strong>Success!</strong> {successMessage}
            <button type="button" className="btn-close" onClick={() => setSuccessMessage("")}></button>
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="toggle-tabs-wrapper">
  <div className="toggle-tabs">
    <div
      className="toggle-slider"
      style={{
        transform: activeTab === 'preExisting' ? 'translateX(0%)' : 'translateX(100%)'
      }}
    />
    <button 
      className={`nav-link ${activeTab === 'preExisting' ? 'active' : ''}`}
      onClick={() => setActiveTab('preExisting')}
    >
      <i className="fa fa-suitcase me-2"></i>
      Pre-made Packages
    </button>
    <button 
      className={`nav-link ${activeTab === 'custom' ? 'active' : ''}`}
      onClick={() => setActiveTab('custom')}
    >
      <i className="fa fa-magic me-2"></i>
      Create Custom Package
    </button>
  </div>
</div>



        {/* Pre-existing Packages Tab */}
        {activeTab === 'preExisting' && (
          <div className="tab-pane fade show active">
            <div className="row mb-4">
              <div className="col-12">
              <div className="text-center">
  <h2>Our Featured Travel Packages</h2>
  <p className="text-muted">Select from our professionally designed travel experiences</p>
</div>

              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading available packages...</p>
              </div>
            ) : packages.length === 0 ? (
              <div className="text-center py-5">
                <div className="alert alert-info">
                  <i className="fa fa-info-circle me-2"></i>
                  No packages available at the moment. Please check back later.
                </div>
              </div>
            ) : (
              <div className="row">
                {packages.map((packageData) => (
                  <div key={packageData.package_id} className="col-lg-4 col-md-6 mb-4">
                    <div className="card package-card h-100 shadow-sm hover-elevate">
                      <div className="position-relative">
                        <img
                          src={packageData.country_picture || "/placeholder-country.jpg"}
                          className="card-img-top"
                          alt={`${packageData.country_name} image`}
                          style={{ height: "200px", objectFit: "cover" }}
                        />
                        <div className="package-price position-absolute top-0 end-0 m-3">
                          <span className="badge bg-primary p-2 fs-6">${packageData.total_price}</span>
                        </div>
                      </div>
                      <div className="card-body">
                        <h5 className="card-title fw-bold">{packageData.country_name}</h5>
                        <div className="package-info d-flex justify-content-between mb-3">
                          <span><i className="fa fa-calendar-alt me-1 text-primary"></i> {packageData.total_days_stayed} days</span>
                          <span><i className="fa fa-users me-1 text-primary"></i> {packageData.num_people} people</span>
                        </div>
                        <p className="text-muted">
                          <i className="fa fa-user-tie me-1"></i> Guide: {packageData.guide_name}
                        </p>

                        <div className="package-details">
                          <h6 className="mb-2"><i className="fa fa-map-marker-alt me-2 text-primary"></i>Destinations:</h6>
                          {Array.isArray(packageData.cities) && packageData.cities.length > 0 ? (
                            <ul className="list-group list-group-flush mb-3">
                              {packageData.cities.slice(0, 2).map((city) => (
                                <li key={city.package_city_id} className="list-group-item px-0 py-2 border-0">
                                  <div className="d-flex justify-content-between">
                                    <span>{city.city_name}</span>
                                    <span className="badge bg-light text-dark">{city.days_stayed} days</span>
                                  </div>
                                </li>
                              ))}
                              {packageData.cities.length > 2 && (
                                <li className="list-group-item px-0 py-1 border-0 text-center">
                                  <small className="text-muted">+ {packageData.cities.length - 2} more cities</small>
                                </li>
                              )}
                            </ul>
                          ) : (
                            <p className="text-muted small fst-italic">No cities information available</p>
                          )}
                        </div>

                        <div className="d-grid gap-2 d-md-flex justify-content-between mt-3">
                          <Link to={`/packages/${packageData.package_id}`} className="btn btn-outline-primary">
                            <i className="fa fa-info-circle me-1"></i> Details
                          </Link>
                          <button
                            className="btn btn-primary"
                            onClick={() => handleBookPackage(packageData.package_id)}
                          >
                            <i className="fa fa-calendar-check me-1"></i> Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Custom Package Tab */}
        {activeTab === 'custom' && (
          <div className="tab-pane fade show active">
            <div className="row mb-4">
              <div className="col-12">
                <div className="text-center">
                  <h2>Create Your Dream Trip</h2>
                  <p className="text-muted">Customize every aspect of your journey</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-primary text-white">
                  <h4 className="mb-0"><i className="fa fa-globe me-2"></i>Destination & Guide</h4>
                </div>
                <div className="card-body">
                  <div className="row">
                    {/* Country Selection */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">Select Country:</label>
                      <select
                        className="form-select form-select-lg"
                        onChange={handleCountryChange}
                        value={selectedCountry || ""}
                        disabled={isLoading}
                      >
                        <option value="" disabled>Select a country</option>
                        {countries.map((country) => (
                          <option key={country.country_id} value={country.country_id}>
                            {country.country_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Guide Selection */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">Select Guide:</label>
                      <select
                        className="form-select form-select-lg"
                        onChange={(e) => setSelectedGuide(e.target.value)}
                        value={selectedGuide || ""}
                        disabled={!selectedCountry || guides.length === 0}
                      >
                        <option value="" disabled>Select a guide</option>
                        {guides.map((guide) => (
                          <option key={guide.guide_id} value={guide.guide_id}>
                            {guide.guide_name} - ${guide.per_day_charge}/day
                          </option>
                        ))}
                      </select>
                      {selectedCountry && guides.length === 0 && (
                        <div className="form-text text-danger">No guides available for this country</div>
                      )}
                    </div>

                    {/* Number of Persons */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">Number of Travelers:</label>
                      <div className="input-group">
                        <span className="input-group-text bg-primary text-white">
                          <i className="fa fa-users"></i>
                        </span>
                        <input
                          type="number"
                          min="1"
                          className="form-control form-control-lg"
                          value={numberOfPersons}
                          onChange={(e) => setNumberOfPersons(parseInt(e.target.value) || 1)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cities Selection */}
              {selectedCountry && (
                <div className="card shadow-sm mb-4">
                  <div className="card-header bg-primary text-white">
                    <h4 className="mb-0"><i className="fa fa-city me-2"></i>Select Cities to Visit</h4>
                  </div>
                  <div className="card-body">
                    {cities.length === 0 ? (
                      <div className="alert alert-info">
                        No cities available for this country
                      </div>
                    ) : (
                      <div className="row">
                        {cities.map((city) => (
                          <div key={city.city_id} className="col-md-4 col-sm-6 mb-3">
                            <div className={`card h-100 city-card ${selectedCities.includes(city.city_id) ? 'border-primary' : ''}`}>
                              <div className="card-body">
                                <div className="form-check">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id={`city-${city.city_id}`}
                                    checked={selectedCities.includes(city.city_id)}
                                    onChange={(e) => handleCitySelection(city.city_id, e.target.checked)}
                                  />
                                  <label className="form-check-label fw-bold" htmlFor={`city-${city.city_id}`}>
                                    {city.city_name}
                                  </label>
                                </div>
                                
                                {selectedCities.includes(city.city_id) && (
                                  <div className="mt-3">
                                    <label className="form-label">Days to stay:</label>
                                    <div className="input-group">
                                      <button 
                                        className="btn btn-outline-secondary" 
                                        type="button"
                                        onClick={() => {
                                          const current = daysPerCity[city.city_id] || 1;
                                          if (current > 1) {
                                            handleDaysChange(city.city_id, current - 1);
                                          }
                                        }}
                                      >-</button>
                                      <input
                                        type="number"
                                        min="1"
                                        className="form-control text-center"
                                        value={daysPerCity[city.city_id] || 1}
                                        onChange={(e) => handleDaysChange(city.city_id, parseInt(e.target.value) || 1)}
                                      />
                                      <button 
                                        className="btn btn-outline-secondary" 
                                        type="button"
                                        onClick={() => {
                                          const current = daysPerCity[city.city_id] || 1;
                                          handleDaysChange(city.city_id, current + 1);
                                        }}
                                      >+</button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* City Details */}
              {selectedCities.length > 0 && (
                <div className="accordion mb-4" id="citiesAccordion">
                  {selectedCities.map((cityId, index) => {
                    const city = cities.find((c) => c.city_id === cityId);
                    return (
                      <div className="accordion-item" key={cityId}>
                        <h2 className="accordion-header" id={`heading-${cityId}`}>
                          <button 
                            className="accordion-button" 
                            type="button" 
                            data-bs-toggle="collapse" 
                            data-bs-target={`#collapse-${cityId}`} 
                            aria-expanded={index === 0 ? "true" : "false"} 
                            aria-controls={`collapse-${cityId}`}
                          >
                            <div className="d-flex justify-content-between align-items-center w-100">
                              <span><i className="fa fa-map-marker-alt me-2"></i> {city?.city_name}</span>
                              <span className="badge bg-info ms-2">{daysPerCity[cityId] || 1} day(s)</span>
                            </div>
                          </button>
                        </h2>
                        <div 
                          id={`collapse-${cityId}`} 
                          className={`accordion-collapse collapse ${index === 0 ? "show" : ""}`}
                          aria-labelledby={`heading-${cityId}`} 
                          data-bs-parent="#citiesAccordion"
                        >
                          <div className="accordion-body">
                            <div className="row">
                              {/* Locations */}
                              <div className="col-lg-6 mb-4">
                                <div className="card h-100">
                                  <div className="card-header bg-light">
                                    <h5 className="mb-0"><i className="fa fa-map me-2 text-primary"></i>Tourist Attractions</h5>
                                  </div>
                                  <div className="card-body">
                                    {renderLocationsList(cityId)}
                                  </div>
                                </div>
                              </div>
                              
                              {/* Hotels */}
                              <div className="col-lg-6 mb-4">
                                <div className="card h-100">
                                  <div className="card-header bg-light">
                                    <h5 className="mb-0"><i className="fa fa-bed me-2 text-primary"></i>Accommodation</h5>
                                  </div>
                                  <div className="card-body">
                                    {renderHotelsList(cityId)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Submit Button */}
              <div className="d-grid">
                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg py-3"
                  disabled={isLoading || selectedCities.length === 0 || !selectedCountry || !selectedGuide}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="fa fa-paper-plane me-2"></i>
                      Create My Custom Package
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Add CSS for custom styling */}
      <style jsx>{`
        .hero-header {
          background-image: url('/public/assets/img/pexels-pixabay-270756.jpg') no-repeat center center;
          background-size: cover;
          background-position: center;
          margin-bottom: 0 !important; /* Double override to ensure it takes effect */

        }
        
        .package-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .hover-elevate:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
        
        .city-card {
          transition: all 0.3s ease;
        }
        
        .city-card:hover {
          border-color: var(--bs-primary);
        }
        
        .custom-checkbox .form-check-input:checked {
          background-color: var(--bs-primary);
          border-color: var(--bs-primary);
        }
        
        .hotel-item {
          transition: all 0.3s ease;
        }
        
        .hotel-item:hover {
          border-color: var(--bs-primary);
        }
        
        .section-title {
  margin-bottom: 2rem;
  text-align: center;  /* This explicitly centers the text */
}
        
        .section-title h2 {
  position: relative;
  display: inline-block;
  padding-bottom: 0.5rem;
  margin: 0 auto;  /* This helps center the element */
}
        
        section-title h2::after {
  content: '';
  position: absolute;
  left: 25%;
  bottom: 0;
  width: 50%;
  height: 3px;
  background-color: var(--bs-primary);
}
        
        /* Custom Tabs */
        .nav-pills .nav-link {
          color: var(--bs-dark);
          background-color: #f8f9fa;
          border-radius: 0.5rem;
          margin: 0 0.5rem;
          padding: 1rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .nav-pills .nav-link.active {
          background-color: var(--bs-primary);
          color: white;
          box-shadow: 0 4px 8px rgba(0,123,255,0.2);
        }
        
        /* Custom Accordion */
        .accordion-button:not(.collapsed) {
          background-color: rgba(0,123,255,0.1);
          color: var(--bs-primary);
          box-shadow: none;
        }
        
        /* Form Styling */
        .form-select:focus, .form-control:focus {
          border-color: var(--bs-primary);
          box-shadow: 0 0 0 0.25rem rgba(0,123,255,0.25);
        }
          .toggle-tabs-wrapper {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
  position: relative;
}

.toggle-tabs {
  background-color: #e0e0e0;
  border-radius: 9999px;
  display: inline-flex;
  position: relative;
  overflow: hidden;
  padding: 4px;
}

/* Sliding background */
.toggle-slider {
  position: absolute;
  top: 4px;
  bottom: 4px;
  width: 50%;
  background-color: var(--bs-primary);
  border-radius: 9999px;
  transition: transform 0.3s ease;
  z-index: 1;
}

/* Tab buttons */
.toggle-tabs .nav-link {
  position: relative;
  z-index: 2;
  flex: 1;
  text-align: center;
  border-radius: 9999px;
  color: #333;
  font-weight: 600;
  background-color: transparent;
  border: none;
  padding: 0.75rem 1.5rem;
  transition: color 0.3s ease;
}

.toggle-tabs .nav-link.active {
  color: white;
}
      `}</style>
    </>
  );
};

export default Packages;