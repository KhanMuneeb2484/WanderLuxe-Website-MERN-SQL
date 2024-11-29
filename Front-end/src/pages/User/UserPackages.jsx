import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Packages = () => {
  const [countries, setCountries] = useState([]); // State for countries
  const [selectedCountry, setSelectedCountry] = useState(null); // State for selected country
  const [guides, setGuides] = useState([]); // State for guides
  const [selectedGuide, setSelectedGuide] = useState(null); // State for selected guide
  const [cities, setCities] = useState([]); // State for cities
  const [selectedCities, setSelectedCities] = useState([]); // State for selected cities
  const [locations, setLocations] = useState({}); // State for locations
  const [selectedLocations, setSelectedLocations] = useState({}); // State for selected locations
  const [hotels, setHotels] = useState({}); // State for hotels
  const [selectedHotels, setSelectedHotels] = useState({}); // State for selected hotels
  const [numberOfPersons, setNumberOfPersons] = useState(1); // State for number of persons
  const [daysPerCity, setDaysPerCity] = useState({}); // State for number of days per city
  const { user, logout } = useContext(AuthContext); // Auth context for user data
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const token = localStorage.getItem("token"); // Token from local storage

  // Fetch countries
  const fetchCountries = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/countries/get-all-countries`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCountries(data);
      } else {
        console.error("Failed to fetch countries");
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  // Fetch guides for selected country
  const fetchGuides = async (countryId) => {
    console.log("countryId", countryId);
    try {
      const response = await fetch(
        `http://localhost:3000/api/guides/get-guides-by-countryId/${countryId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setGuides(data);
      } else {
        console.error("Failed to fetch guides");
      }
    } catch (error) {
      console.error("Error fetching guides:", error);
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
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setCities(data);
      } else {
        console.error("Failed to fetch cities");
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
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
            Authorization: `Bearer ${token}`,
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
            Authorization: `Bearer ${token}`,
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

  // Update data when country is selected
  useEffect(() => {
    if (selectedCountry) {
      fetchGuides(selectedCountry);
      fetchCities(selectedCountry);
    }
  }, [selectedCountry]);

  // Fetch countries on component load
  useEffect(() => {
    fetchCountries();
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
    if (isChecked) fetchLocations(cityId);
  };

  const handleLocationSelection = (cityId, locationId, isChecked) => {
    setSelectedLocations((prev) => ({
      ...prev,
      [cityId]: isChecked
        ? [...(prev[cityId] || []), locationId]
        : prev[cityId]?.filter((id) => id !== locationId),
    }));
    if (isChecked) fetchHotels(cityId);
  };

  const handleHotelSelection = (cityId, hotelId) => {
    setSelectedHotels((prev) => ({
      ...prev,
      [cityId]: hotelId,
    }));
  };

  const handleDaysChange = (cityId, days) => {
    setDaysPerCity((prev) => ({
      ...prev,
      [cityId]: days,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const packageData = {
      country_id: selectedCountry,
      guide_id: selectedGuide,
      number_of_persons: numberOfPersons,
      cities: selectedCities.map((cityId) => ({
        city_id: cityId,
        locations: selectedLocations[cityId] || [],
        hotel_id: selectedHotels[cityId] || [],
        days: daysPerCity[cityId] || 0, // Add days to the package data
      })),
    };
    console.log("Submitting package:", packageData);
    try {
      const response = await fetch("http://localhost:3000/api/packages/create-package", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(packageData),
      });
      if (response.ok) {
        const data = await response.json();
        alert(`Package created successfully: ${data.package_id}`);
      } else {
        console.error("Failed to create package");
      }
    } catch (error) {
      console.error("Error creating package:", error);
    }
  };

  return (
    <form className="container mt-4" onSubmit={handleSubmit}>
      <h2>Create Custom Package</h2>
      {/* Country Selection */}
      <div className="mb-3">
        <label>Select Country:</label>
        <select
          className="form-select"
          onChange={handleCountryChange}
          value={selectedCountry || ""}
        >
          <option value="" disabled>
            Select a country
          </option>
          {countries.map((country) => (
            <option key={country.country_id} value={country.country_id}>
              {country.country_name}
            </option>
          ))}
        </select>
      </div>
      {/* Guide Selection */}
      <div className="mb-3">
        <label>Select Guide:</label>
        <select
          className="form-select"
          onChange={(e) => setSelectedGuide(e.target.value)}
          value={selectedGuide || ""}
        >
          <option value="" disabled>
            Select a guide
          </option>
          {guides.map((guide) => (
            <option key={guide.guide_id} value={guide.guide_id}>
              {guide.guide_name} - ${guide.per_day_charge}/day
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label>Number of persons:</label>
        <input type="number" 
        min="1"
        className="form-control"
        value={numberOfPersons}
        onChange={(e) => setNumberOfPersons(e.target.valueAsNumber)}
        />
      </div>
      {/* Cities */}
      <div className="mb-3">
        <label>Select Cities:</label>
        {cities.map((city) => (
          <div key={city.city_id} className="form-check">
            <input
              type="checkbox"
              value={city.city_id}
              className="form-check-input"
              onChange={(e) =>
                handleCitySelection(city.city_id, e.target.checked)
              }
            />
            <label>{city.city_name}</label>
            {/* Number of days input */}
            {selectedCities.includes(city.city_id) && (
              <div className="mb-2">
                <label>Number of days in {city.city_name}:</label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  value={daysPerCity[city.city_id] || 1}
                  onChange={(e) => handleDaysChange(city.city_id, e.target.value)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Locations */}
      {Object.entries(locations).map(([cityId, cityLocations]) => (
        <div key={cityId}>
          <h4>Locations in {cities.find((city) => city.city_id === parseInt(cityId))?.city_name}</h4>
          {cityLocations.map((location) => (
            <div key={location.location_id} className="form-check">
              <input
                type="checkbox"
                value={location.location_id}
                className="form-check-input"
                onChange={(e) =>
                  handleLocationSelection(cityId, location.location_id, e.target.checked)
                }
              />
              <label>{location.location_name}</label>
            </div>
          ))}
        </div>
      ))}
      {/* Hotels */}
      {Object.entries(hotels).map(([cityId, cityHotels]) => (
        <div key={cityId}>
          <h4>Hotels in {cities.find((city) => city.city_id === parseInt(cityId))?.city_name}</h4>
          {Array.isArray(cityHotels) ? (
            cityHotels.map((hotel) => (
              <div key={hotel.hotel_id} className="form-check">
                <input
                  type="radio"
                  name={`hotel-${cityId}`} // Group radio buttons by city
                  value={hotel.hotel_id}
                  className="form-check-input"
                  onChange={() => handleHotelSelection(cityId, hotel.hotel_id)}
                />
                <label>{hotel.hotel_name}</label>
              </div>
            ))
          ) : (
            <p>No hotels available for this city yet.</p>
          )}
        </div>
      ))}

      <button type="submit" className="btn btn-primary mt-3">
        Create Package
      </button>
    </form>
  );
};

export default Packages;
