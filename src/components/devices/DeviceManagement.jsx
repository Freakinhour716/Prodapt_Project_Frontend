// src/components/devices/DeviceManagement.jsx
import React, { useEffect, useState } from "react";
import api from "../../services/api";
import DeviceForm from "./DeviceForm";
import DeviceList from "./DeviceList";
import "./DeviceManagement.css";

const DeviceManagement = () => {
  const [devices, setDevices] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingDevice, setEditingDevice] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // ✅ Pagination State
  const [page, setPage] = useState(0);
  const [size] = useState(4);
  const [totalPages, setTotalPages] = useState(0);

  // ✅ Fetch Devices with Pagination
  const fetchDevices = async (pageNumber = page) => {
    try {
      const response = await api.get(`/devices/page?page=${pageNumber}&size=${size}`);
      setDevices(response.data.content);
      setFilteredDevices(response.data.content);
      setTotalPages(response.data.totalPages);
      setPage(pageNumber);
    } catch (error) {
      console.error("Error fetching devices:", error);
      alert("❌ Unable to fetch devices from server");
    }
  };

  useEffect(() => {
    fetchDevices(0);
  }, []);

  // ✅ Filter / Search Logic
  const handleFilter = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredDevices(devices);
    } else {
      const filtered = devices.filter(
        (d) =>
          d.deviceId.toLowerCase().includes(term.toLowerCase()) ||
          d.type.toLowerCase().includes(term.toLowerCase()) ||
          d.model?.toLowerCase().includes(term.toLowerCase()) ||
          d.location?.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredDevices(filtered);
    }
  };

  // ✅ Show Add Form
  const handleAddClick = () => {
    setEditingDevice(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ Edit existing device
  const handleEdit = (device) => {
    setEditingDevice(device);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ Close form handler
  const closeForm = () => {
    setEditingDevice(null);
    setShowForm(false);
  };

  // ✅ Pagination handlers
  const handleNext = () => page < totalPages - 1 && fetchDevices(page + 1);
  const handlePrev = () => page > 0 && fetchDevices(page - 1);

  return (
    <div className="device-container">
      <h1>Device Management</h1>

      {/* 🔍 Search + Add Device Bar */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by ID, Type, Model, or Location..."
          value={searchTerm}
          onChange={(e) => handleFilter(e.target.value)}
        />
        <button className="btn-add" onClick={handleAddClick}>
          + Add Device
        </button>
      </div>

      {/* ✅ Form - only visible when adding/editing */}
      {showForm && (
        <DeviceForm
          fetchDevices={() => fetchDevices(page)}
          editingDevice={editingDevice}
          setEditingDevice={setEditingDevice}
          closeForm={closeForm}
        />
      )}

      {/* ✅ Device List */}
      <DeviceList
        devices={filteredDevices}
        fetchDevices={() => fetchDevices(page)}
        setEditingDevice={handleEdit}
      />

      {/* ✅ Pagination */}
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
};

export default DeviceManagement;
