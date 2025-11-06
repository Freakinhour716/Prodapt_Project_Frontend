// src/components/devices/DeviceManagement.jsx
import React, { useContext, useEffect, useState } from "react";
import api from "../../services/api";
import DeviceForm from "./DeviceForm";
import DeviceList from "./DeviceList";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "./DeviceManagement.css";
import { AuthContext } from "../../context/AuthContext"; // ✅ Role-based access

const DeviceManagement = () => {
  const { canManage } = useContext(AuthContext); // ✅ Permission

  const [devices, setDevices] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingDevice, setEditingDevice] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // ✅ Pagination State
  const [page, setPage] = useState(0);
  const size = 4;
  const [totalPages, setTotalPages] = useState(0);

  const fetchDevices = async (pageNumber = page) => {
    try {
      const response = await api.get(
        `/devices/page?page=${pageNumber}&size=${size}`
      );
      setDevices(response.data.content || []);
      setFilteredDevices(response.data.content || []);
      setTotalPages(response.data.totalPages);
      setPage(pageNumber);
    } catch (error) {
      toast.error("❌ Unable to fetch devices");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDevices(0);
  }, []);

  const fetchAllDevices = async () => {
    const res = await api.get("/devices");
    return res.data;
  };

  const exportCSV = async () => {
    const allDevices = await fetchAllDevices();
    const csvRows = [
      ["Device ID", "Type", "Model", "IP Address", "Location", "Status"],
      ...allDevices.map((d) => [
        d.deviceId,
        d.type,
        d.model,
        d.ipAddress,
        d.location,
        d.status,
      ]),
    ];

    const csvString = csvRows.map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvString], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "Device_Report.csv");
    a.click();

    toast.success("✅ CSV exported!");
  };

  const exportPDF = async () => {
    try {
      const allDevices = await fetchAllDevices();
      const doc = new jsPDF({ orientation: "landscape" });
      doc.text("Device Report", 14, 12);

      autoTable(doc, {
        startY: 18,
        head: [
          ["Device ID", "Type", "Model", "IP Address", "Location", "Status"],
        ],
        body: allDevices.map((d) => [
          d.deviceId,
          d.type,
          d.model,
          d.ipAddress,
          d.location,
          d.status,
        ]),
        theme: "grid",
      });

      doc.save("Device_Report.pdf");
      toast.success("📄 PDF exported!");
    } catch (error) {
      toast.error("❌ PDF export failed!");
    }
  };

  const handleFilter = (term) => {
    setSearchTerm(term);
    if (!term.trim()) return setFilteredDevices(devices);

    const filtered = devices.filter(
      (d) =>
        d.deviceId.toLowerCase().includes(term.toLowerCase()) ||
        d.type.toLowerCase().includes(term.toLowerCase()) ||
        d.model?.toLowerCase().includes(term.toLowerCase()) ||
        d.location?.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredDevices(filtered);
  };

  // ✅ Restricted: Add/Edit not allowed for Auditor
  const handleAddClick = () => {
    if (!canManage) return toast.error("🚫 Read-only mode: No permission");
    setEditingDevice(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEdit = (device) => {
    if (!canManage) return toast.error("🚫 Read-only mode: No permission");
    setEditingDevice(device);
    setShowForm(true);
  };

  const closeForm = () => {
    setEditingDevice(null);
    setShowForm(false);
  };

  const handleNext = () =>
    page < totalPages - 1 && fetchDevices(page + 1);
  const handlePrev = () =>
    page > 0 && fetchDevices(page - 1);

  return (
    <div className="device-container">
      <h1>Device Management</h1>

      {/* 🔍 Search + Actions */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by ID, Type, Model, or Location..."
          value={searchTerm}
          onChange={(e) => handleFilter(e.target.value)}
        />

        <button
          className="btn-add"
          onClick={handleAddClick}
          disabled={!canManage}
          style={!canManage ? { opacity: 0.4, cursor: "not-allowed" } : {}}
        >
          + Add Device
        </button>

        <button className="btn-export" onClick={exportCSV}>
          Export CSV
        </button>
        <button className="btn-export" onClick={exportPDF}>
          Export PDF
        </button>
      </div>

      {showForm && (
        <DeviceForm
          fetchDevices={() => fetchDevices(page)}
          editingDevice={editingDevice}
          setEditingDevice={setEditingDevice}
          closeForm={closeForm}
        />
      )}

      <DeviceList
        devices={filteredDevices}
        fetchDevices={() => fetchDevices(page)}
        setEditingDevice={handleEdit} // ✅ Edit restricted inside handler
      />

      {/* ✅ Pagination */}
      <div className="pagination">
        <button onClick={handlePrev} disabled={page === 0}>
          ◀ Previous
        </button>
        <span>Page {page + 1} of {totalPages}</span>
        <button
          onClick={handleNext}
          disabled={page >= totalPages - 1}
        >
          Next ▶
        </button>
      </div>
    </div>
  );
};

export default DeviceManagement;
