import React, { useEffect, useState } from "react";

const AdminGuides = () => {
  const [guides, setGuides] = useState([]); // List of guides
  const [newGuide, setNewGuide] = useState({ name: "", countryId: "", charge: 0 }); // New guide details
  const [editingGuide, setEditingGuide] = useState(null); // Guide being edited
  const [countries, setCountries] = useState([]); // List of countries
  const token = localStorage.getItem("token");

  // Fetch all guides
  const fetchGuides = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/guides/get-all-guides", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
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

  // Fetch countries
  const fetchCountries = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/countries/get-all-countries", {
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

  // Add a new guide
  const addGuide = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/guides/create-guide", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newGuide),
      });
      if (response.ok) {
        alert("Guide added successfully!");
        setNewGuide({ name: "", countryId: "", charge: 0 });
        fetchGuides();
      } else {
        console.error("Failed to add guide");
      }
    } catch (error) {
      console.error("Error adding guide:", error);
    }
  };

  // Update an existing guide
  const updateGuide = async (guideId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/guides/update-guide/${guideId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingGuide),
      });
      if (response.ok) {
        alert("Guide updated successfully!");
        setEditingGuide(null);
        fetchGuides();
      } else {
        console.error("Failed to update guide");
      }
    } catch (error) {
      console.error("Error updating guide:", error);
    }
  };

  // Delete a guide
  const deleteGuide = async (guideId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/guides/delete-guide/${guideId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        alert("Guide deleted successfully!");
        fetchGuides();
      } else {
        console.error("Failed to delete guide");
      }
    } catch (error) {
      console.error("Error deleting guide:", error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchGuides();
    fetchCountries();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Admin: Manage Guides</h2>

      {/* Add Guide Form */}
      <div className="card mb-4">
        <div className="card-body">
          <h5>Add New Guide</h5>
          <div className="mb-3">
            <label>Guide Name:</label>
            <input
              type="text"
              className="form-control"
              value={newGuide.name}
              onChange={(e) => setNewGuide({ ...newGuide, name: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label>Country:</label>
            <select
              className="form-select"
              value={newGuide.countryId}
              onChange={(e) => setNewGuide({ ...newGuide, countryId: e.target.value })}
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.country_id} value={country.country_id}>
                  {country.country_name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label>Per Day Charge ($):</label>
            <input
              type="number"
              min="0"
              className="form-control"
              value={newGuide.charge}
              onChange={(e) => setNewGuide({ ...newGuide, charge: e.target.valueAsNumber })}
            />
          </div>
          <button className="btn btn-primary" onClick={addGuide}>
            Add Guide
          </button>
        </div>
      </div>

      {/* Guides List */}
      <h4>Existing Guides</h4>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Country</th>
            <th>Charge</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {guides.map((guide) => (
            <tr key={guide.guide_id}>
              <td>
                {editingGuide && editingGuide.guide_id === guide.guide_id ? (
                  <input
                    type="text"
                    value={editingGuide.name}
                    onChange={(e) => setEditingGuide({ ...editingGuide, name: e.target.value })}
                  />
                ) : (
                  guide.guide_name
                )}
              </td>
              <td>
                {editingGuide && editingGuide.guide_id === guide.guide_id ? (
                  <select
                    value={editingGuide.countryId}
                    onChange={(e) => setEditingGuide({ ...editingGuide, countryId: e.target.value })}
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country.country_id} value={country.country_id}>
                        {country.country_name}
                      </option>
                    ))}
                  </select>
                ) : (
                  countries.find((c) => c.country_id === guide.country_id)?.country_name
                )}
              </td>
              <td>
                {editingGuide && editingGuide.guide_id === guide.guide_id ? (
                  <input
                    type="number"
                    min="0"
                    value={editingGuide.charge}
                    onChange={(e) => setEditingGuide({ ...editingGuide, charge: e.target.valueAsNumber })}
                  />
                ) : (
                  `$${guide.per_day_charge}`
                )}
              </td>
              <td>
                {editingGuide && editingGuide.guide_id === guide.guide_id ? (
                  <>
                    <button className="btn btn-success me-2" onClick={() => updateGuide(guide.guide_id)}>
                      Save
                    </button>
                    <button className="btn btn-secondary" onClick={() => setEditingGuide(null)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-warning me-2"
                      onClick={() => setEditingGuide({ ...guide, countryId: guide.country_id })}
                    >
                      Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => deleteGuide(guide.guide_id)}>
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminGuides;
