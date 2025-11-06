// src/components/licenses/LicenseManagement.jsx
import React, { useEffect, useState } from "react";
import api from "../../services/api";
import LicenseForm from "./LicenseForm";
import LicenseList from "./LicenseList";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LicenseManagement.css";

export default function LicenseManagement() {
  const [licenses, setLicenses] = useState([]);
  const [filteredLicenses, setFilteredLicenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingLicense, setEditingLicense] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // ✅ Pagination
  const [page, setPage] = useState(0);
  const size = 5;
  const [totalPages, setTotalPages] = useState(0);

  // ✅ Fetch paginated licenses + usage count
  const fetchLicenses = async (pageNum = page) => {
    try {
      const res = await api.get(`/licenses/page?page=${pageNum}&size=${size}`);

      const enrichedData = await Promise.all(
        res.data.content.map(async (lic) => {
          try {
            const usageRes = await api.get(`/assignments/count/${lic.licenseKey}`);
            return { ...lic, assignedCount: usageRes.data };
          } catch {
            return { ...lic, assignedCount: 0 };
          }
        })
      );

      setLicenses(enrichedData);
      setFilteredLicenses(enrichedData);
      setTotalPages(res.data.totalPages);
      setPage(res.data.number);
    } catch (error) {
      console.error("Fetch Licenses Error:", error);
      toast.error("❌ Failed to load data!");
    }
  };

  useEffect(() => {
    fetchLicenses(0);
  }, []);

  // ✅ Search filter
  const handleFilter = (term) => {
    setSearchTerm(term);

    if (!term.trim()) return setFilteredLicenses(licenses);

    const filtered = licenses.filter((l) =>
      l.licenseKey.toLowerCase().includes(term.toLowerCase()) ||
      l.softwareName.toLowerCase().includes(term.toLowerCase()) ||
      String(l.vendorId)?.includes(term)
    );

    setFilteredLicenses(filtered);
  };

  // ✅ Add License Form
  const handleAddClick = () => {
    setEditingLicense(null);
    setShowForm(true);
  };

  // ✅ Edit License Form
  const handleEdit = (license) => {
    setEditingLicense(license);
    setShowForm(true);
  };

  const closeForm = () => {
    setEditingLicense(null);
    setShowForm(false);
  };

  // ✅ Pagination Controls
  const handlePrev = () => page > 0 && fetchLicenses(page - 1);
  const handleNext = () => page < totalPages - 1 && fetchLicenses(page + 1);

  return (
    <div className="license-container">
      <h1>License Management</h1>

      {/* ✅ Filter & Add */}
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

      {/* ✅ Overlay Popup Form */}
      {showForm && (
        <div className="overlay">
          <div className="popup">
            <LicenseForm
              fetchLicenses={() => fetchLicenses(page)}
              editingLicense={editingLicense}
              setEditingLicense={setEditingLicense}
              closeForm={closeForm}
            />
          </div>
        </div>
      )}

      {/* ✅ License Table Component */}
      <LicenseList
        licenses={filteredLicenses}
        handleEdit={handleEdit}
        handleDelete={async (key) => {
          if (!window.confirm("🗑️ Are you sure you want to delete this license?"))
            return;

          try {
            await api.delete(`/licenses/${key}`);
            toast.success("✅ License deleted successfully!");
            fetchLicenses(page);
          } catch (error) {
            console.error(error);
            toast.error("❌ Delete failed!");
          }
        }}
      />

      {/* ✅ Pagination Buttons */}
      <div className="pagination">
        <button onClick={handlePrev} disabled={page === 0}>
          ◀ Previous
        </button>

        <span>
          Page {page + 1} of {totalPages}
        </span>

        <button onClick={handleNext} disabled={page >= totalPages - 1}>
          Next ▶
        </button>
      </div>
    </div>
  );
}
