import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomPackageForm = () => {
  const countryId = 2; // Hardcoded country ID
  const [guides, setGuides] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [cities, setCities] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [locations, setLocations] = useState({});
  const [selectedLocations, setSelectedLocations] = useState({});
  const [hotels, setHotels] = useState({});
  const [selectedHotels, setSelectedHotels] = useState({});
  const [numberOfPersons, setNumberOfPersons] = useState(1);

  // Fetch guides when the component loads (based on country ID)
  useEffect(() => {
    axios.get(`/api/guides?country_id=${countryId}`).then(response => {
      setGuides(response.data);
    });
  }, []);

  // Fetch cities when the component loads (based on country ID)
  useEffect(() => {
    axios.get(`/api/cities?country_id=${countryId}`).then(response => {
      setCities(response.data);
    });
  }, []);

  // Fetch locations dynamically for selected cities
  useEffect(() => {
    const fetchLocations = async () => {
      const newLocations = {};
      for (const city of selectedCities) {
        const response = await axios.get(`/api/locations?city_id=${city}`);
        newLocations[city] = response.data;
      }
      setLocations(newLocations);
    };
    if (selectedCities.length > 0) fetchLocations();
  }, [selectedCities]);

  // Fetch hotels dynamically for selected locations
  useEffect(() => {
    const fetchHotels = async () => {
      const newHotels = {};
      for (const [city, cityLocations] of Object.entries(selectedLocations)) {
        for (const location of cityLocations) {
          const response = await axios.get(`/api/hotels?location_id=${location}`);
          newHotels[location] = response.data;
        }
      }
      setHotels(newHotels);
    };
    if (Object.keys(selectedLocations).length > 0) fetchHotels();
  }, [selectedLocations]);

  const handleSubmit = async e => {
    e.preventDefault();
    const packageData = {
      country_id: countryId,
      guide_id: selectedGuide,
      number_of_persons: numberOfPersons,
      cities: selectedCities.map(cityId => ({
        city_id: cityId,
        locations: selectedLocations[cityId] || [],
        hotels: selectedLocations[cityId]?.map(locationId => selectedHotels[locationId]) || [],
      })),
    };
    const response = await axios.post('/api/packages', packageData);
    alert(`Package created successfully: ${response.data.package_id}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Custom Package</h2>

      {/* Guide Selection */}
      {guides.length > 0 && (
        <>
          <label>Select Guide:</label>
          <select onChange={e => setSelectedGuide(e.target.value)} value={selectedGuide || ''}>
            <option value="" disabled>Select a guide</option>
            {guides.map(guide => (
              <option key={guide.guide_id} value={guide.guide_id}>
                {guide.guide_name} - ${guide.per_day_charge}/day
              </option>
            ))}
          </select>
        </>
      )}

      {/* Number of Persons */}
      <label>Number of Persons:</label>
      <input
        type="number"
        min="1"
        value={numberOfPersons}
        onChange={e => setNumberOfPersons(e.target.value)}
      />

      {/* City Selection */}
      {cities.length > 0 && (
        <>
          <label>Select Cities:</label>
          {cities.map(city => (
            <div key={city.city_id}>
              <input
                type="checkbox"
                value={city.city_id}
                onChange={e => {
                  const cityId = e.target.value;
                  setSelectedCities(prev =>
                    e.target.checked ? [...prev, cityId] : prev.filter(id => id !== cityId)
                  );
                }}
              />
              {city.city_name}
            </div>
          ))}
        </>
      )}

      {/* Location Selection */}
      {Object.keys(locations).length > 0 && (
        <>
          <h3>Select Locations</h3>
          {Object.entries(locations).map(([cityId, cityLocations]) => (
            <div key={cityId}>
              <h4>Locations in City {cityId}</h4>
              {cityLocations.map(location => (
                <div key={location.location_id}>
                  <input
                    type="checkbox"
                    value={location.location_id}
                    onChange={e => {
                      const locationId = e.target.value;
                      setSelectedLocations(prev => ({
                        ...prev,
                        [cityId]: e.target.checked
                          ? [...(prev[cityId] || []), locationId]
                          : prev[cityId]?.filter(id => id !== locationId),
                      }));
                    }}
                  />
                  {location.location_name}
                </div>
              ))}
            </div>
          ))}
        </>
      )}

      {/* Hotel Selection */}
      {Object.keys(hotels).length > 0 && (
        <>
          <h3>Select Hotels</h3>
          {Object.entries(hotels).map(([locationId, locationHotels]) => (
            <div key={locationId}>
              <h4>Hotels for Location {locationId}</h4>
              {locationHotels.map(hotel => (
                <div key={hotel.hotel_id}>
                  <input
                    type="radio"
                    name={`hotel_${locationId}`}
                    value={hotel.hotel_id}
                    onChange={e =>
                      setSelectedHotels(prev => ({
                        ...prev,
                        [locationId]: e.target.value,
                      }))
                    }
                  />
                  {hotel.hotel_name} - ${hotel.cost_per_day}/day
                </div>
              ))}
            </div>
          ))}
        </>
      )}

      {/* Submit Button */}
      <button type="submit">Create Package</button>
    </form>
  );
};

export default CustomPackageForm;
