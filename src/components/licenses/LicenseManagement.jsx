// src/components/licenses/LicenseManagement.jsx
import React, { useEffect, useState } from "react";
import api from "../../services/api";
import LicenseForm from "./LicenseForm";
import LicenseList from "./LicenseList";
import "./LicenseManagement.css";

export default function LicenseManagement() {
  const [licenses, setLicenses] = useState([]);
  const [filteredLicenses, setFilteredLicenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingLicense, setEditingLicense] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchLicenses = async () => {
    try {
      const res = await api.get("/licenses");
      setLicenses(res.data);
      setFilteredLicenses(res.data);
    } catch (error) {
      console.error("Error fetching licenses:", error);
    }
  };

  useEffect(() => {
    fetchLicenses();
  }, []);

  const handleFilter = (term) => {
    setSearchTerm(term);
    if (!term.trim()) return setFilteredLicenses(licenses);

    const filtered = licenses.filter(
      (l) =>
        l.licenseKey.toLowerCase().includes(term.toLowerCase()) ||
        l.softwareName.toLowerCase().includes(term.toLowerCase()) ||
        String(l.vendorId)?.includes(term)
    );
    setFilteredLicenses(filtered);
  };

  const handleAddClick = () => {
    setEditingLicense(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEdit = (license) => {
    setEditingLicense(license);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeForm = () => {
    setEditingLicense(null);
    setShowForm(false);
  };

  return (
    <div className="license-container">
      <h1>License Management</h1>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by License Key, Software, Vendor ID..."
          value={searchTerm}
          onChange={(e) => handleFilter(e.target.value)}
        />

        <button className="btn-add" onClick={handleAddClick}>
          + Add License
        </button>
      </div>

      {showForm && (
        <LicenseForm
          fetchLicenses={fetchLicenses}
          editingLicense={editingLicense}
          setEditingLicense={setEditingLicense}
          closeForm={closeForm}
        />
      )}

      <LicenseList
        licenses={filteredLicenses}
        handleEdit={handleEdit}
        handleDelete={async (key) => {
          if (!window.confirm("Delete this license?")) return;
          try {
            await api.delete(`/licenses/${key}`);
            fetchLicenses();
          } catch (err) {
            console.error("Delete failed:", err);
          }
        }}
      />
    </div>
  );
}
