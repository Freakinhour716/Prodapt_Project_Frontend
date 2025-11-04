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

  const [license, setLicense] = useState({
    licenseKey: "",
    softwareName: "",
    vendor: { vendorId: "", vendorName: "" },
    validFrom: "",
    validTo: "",
    licenseType: "PER_DEVICE",
    maxUsage: "",
    notes: "",
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("vendor.")) {
      const key = name.split(".")[1];
      setLicense((prev) => ({
        ...prev,
        vendor: { ...prev.vendor, [key]: value },
      }));
    } else {
      setLicense((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLicense) {
        await api.put(`/licenses/${editingLicense.licenseKey}`, license);
      } else {
        await api.post("/licenses", license);
      }
      fetchLicenses();
      resetForm();
    } catch (error) {
      console.error("Error saving license:", error);
    }
  };

  const handleDelete = async (licenseKey) => {
    if (!window.confirm("Are you sure you want to delete this license?")) return;
    try {
      await api.delete(`/licenses/${licenseKey}`);
      fetchLicenses();
    } catch (error) {
      console.error("Error deleting license:", error);
    }
  };

  const handleFilter = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredLicenses(licenses);
    } else {
      const filtered = licenses.filter(
        (l) =>
          l.softwareName.toLowerCase().includes(term.toLowerCase()) ||
          l.vendor?.vendorName?.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredLicenses(filtered);
    }
  };

  const handleEdit = (license) => {
    setEditingLicense(license);
    setLicense(license);
  };

  const resetForm = () => {
    setEditingLicense(null);
    setLicense({
      licenseKey: "",
      softwareName: "",
      vendor: { vendorId: "", vendorName: "" },
      validFrom: "",
      validTo: "",
      licenseType: "PER_DEVICE",
      maxUsage: "",
      notes: "",
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">License Management</h1>

      {/* 🔍 Search Filter */}
      <div className="mb-6 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by software or vendor..."
          value={searchTerm}
          onChange={(e) => handleFilter(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-lg w-1/2"
        />
        <button
          onClick={resetForm}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
        >
          {editingLicense ? "Cancel Edit" : "Clear"}
        </button>
      </div>

      {/* 🧾 License Form */}
      <LicenseForm
        license={license}
        editingLicense={editingLicense}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        resetForm={resetForm}
      />

      {/* 📋 License List */}
      <LicenseList
        licenses={filteredLicenses}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
}
