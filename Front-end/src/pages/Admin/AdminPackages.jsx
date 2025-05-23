import { useState, useEffect,useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const PackagesAdmin = () => {
 
  
  const [loading, setLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
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
  const [packages, setPackages] = useState([]);
  const token = localStorage.getItem("token"); // Token from local storage

  // Fetching countries, guides, cities, locations, and hotels
  const fetchCountries = async () => {
    try {
        const response = await fetch(
            `http://localhost:3000/api/countries/get-all-countries`,
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
            console.error(
                `Failed to fetch locations for city ID ${cityId}`
            );
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

const fetchPackages = async () => {
    try {
        const response = await fetch(
            "http://localhost:3000/api/adminPackages/get-all-packages",
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
            setPackages(data.packages); // Store packages data
        } else {
            console.error("Failed to fetch packages");
        }
    } catch (error) {
        console.error("Error fetching packages:", error);
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
    fetchPackages(); // Fetch pre-existing packages on load
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

const handleHotelSelection = (cityId, hotelId, numRooms) => {
    setSelectedHotels((prev) => ({
        ...prev,
        [cityId]: { hotel_id: hotelId, num_rooms: numRooms },
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
        num_people: numberOfPersons,
        cities: selectedCities.map((cityId) => ({
            city_id: cityId,
            days_stayed: parseInt(daysPerCity[cityId]) || 1,
            locations: (selectedLocations[cityId] || []).map(
                (locationId) => ({
                    location_id: locationId,
                })
            ),
            hotels: [
                {
                    hotel_id: selectedHotels[cityId]?.hotel_id || null,
                    num_rooms:
                        parseInt(selectedHotels[cityId]?.num_rooms) || 1,
                },
            ],
        })),
    };

    console.log("Submitting package:", packageData);

    try {
        const response = await fetch(
            "http://localhost:3000/api/adminPackages/create-package",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(packageData),
            }
        );

        if (response.ok) {
            const data = await response.json();
            console.log(`Package created successfully: ${data.package_id}`);
        } else {
            console.error("Failed to create package");
        }
    } catch (error) {
        console.error("Error creating package:", error);
    }
};

  return (
    <form className="container mt-4 mb-8" onSubmit={handleSubmit}>
      <h2>Create a Custom Package</h2>
      {/* Country Selection */}
      <div className="mb-3">
        <label className="form-label">Select Country:</label>
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

      <div className="mb-3">
                    <label>Select Guide:</label>
                    <select
                        className="form-select"
                        onChange={(e) => setSelectedGuide(e.target.value)}
                        value={selectedGuide || ""}>
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
                    <input
                        type="number"
                        min="1"
                        className="form-control"
                        value={numberOfPersons}
                        onChange={(e) =>
                            setNumberOfPersons(parseInt(e.target.value))
                        }
                    />
                </div>

      {/* Cities Selection */}
      <div>
        <h4>Select Cities:</h4>
        {cities.map((city) => (
          <div key={city.city_id} className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id={`city-${city.city_id}`}
              checked={selectedCities.includes(city.city_id)}
              onChange={(e) =>
                handleCitySelection(city.city_id, e.target.checked)
              }
            />
            <label className="form-check-label" htmlFor={`city-${city.city_id}`}>
              {city.city_name}
            </label>
          </div>
        ))}
      </div>

      {/* Locations and Hotels */}
      {selectedCities.map((cityId) => (
        <div key={cityId} className="mt-3">
          <h5>City: {cities.find((city) => city.city_id === cityId)?.city_name}</h5>

          {/* Days Stayed */}
          <div className="mb-3">
            <label className="form-label">Days to stay:</label>
            <input
              type="number"
              min="1"
              className="form-control"
              value={daysPerCity[cityId] || ""}
              onChange={(e) =>
                handleDaysChange(cityId, parseInt(e.target.value))
              }
            />
          </div>

          {/* Locations */}
          <h6>Select Locations:</h6>
          {locations[cityId]?.map((location) => (
            <div key={location.location_id} className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id={`location-${cityId}-${location.location_id}`}
                checked={selectedLocations[cityId]?.includes(location.location_id) || false}
                onChange={(e) =>
                  handleLocationSelection(cityId, location.location_id, e.target.checked)
                }
              />
              <label
                className="form-check-label"
                htmlFor={`location-${cityId}-${location.location_id}`}
              >
                {location.location_name}
              </label>
            </div>
          ))}

          {/* Hotels */}
          <h6>Select Hotel:</h6>
          {hotels[cityId]?.map((hotel) => (
            <div key={hotel.hotel_id} className="form-check">
              <input
                type="radio"
                name={`hotel-${cityId}`}
                className="form-check-input"
                id={`hotel-${cityId}-${hotel.hotel_id}`}
                onChange={(e) =>
                  handleHotelSelection(cityId, hotel.hotel_id, 1)
                }
              />
              <label
                className="form-check-label"
                htmlFor={`hotel-${cityId}-${hotel.hotel_id}`}
              >
                {hotel.hotel_name}
              </label>
              <div>
                <label className="form-label">Number of rooms:</label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  onChange={(e) =>
                    handleHotelSelection(cityId, hotel.hotel_id, parseInt(e.target.value))
                  }
                />
              </div>
            </div>
          ))}
        </div>
      ))}

      <div className="mt-4">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Submitting..." : "Create Package"}
        </button>
        {feedbackMessage && (
          <div className="mt-2">
            <p>{feedbackMessage}</p>
          </div>
        )}
      </div>
    </form>
  );
};

export default PackagesAdmin;
