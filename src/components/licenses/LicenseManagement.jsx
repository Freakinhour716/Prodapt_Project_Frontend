// src/components/licenses/LicenseManagement.jsx
import React, { useContext, useEffect, useState } from "react";
import api from "../../services/api";
import LicenseForm from "./LicenseForm";
import LicenseList from "./LicenseList";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LicenseManagement.css";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { AuthContext } from "../../context/AuthContext"; // ✅ Access role

export default function LicenseManagement() {
  const { canManage } = useContext(AuthContext); // ✅ Role check

  const [licenses, setLicenses] = useState([]);
  const [filteredLicenses, setFilteredLicenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingLicense, setEditingLicense] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // ✅ Pagination
  const [page, setPage] = useState(0);
  const size = 5;
  const [totalPages, setTotalPages] = useState(0);

  // ✅ Fetch paginated licenses + assigned device count
  const fetchLicenses = async (pageNum = page) => {
    try {
      const res = await api.get(`/licenses/page?page=${pageNum}&size=${size}`);

      const enrichedData = await Promise.all(
        res.data.content.map(async (lic) => {
          try {
            const usageRes = await api.get(`/assignments/count/${lic.licenseKey}`);
            return {
              ...lic,
              vendor: lic.vendor || null,
              assignedCount: usageRes.data,
            };
          } catch {
            return {
              ...lic,
              vendor: lic.vendor || null,
              assignedCount: 0,
            };
          }
        })
      );

      setLicenses(enrichedData);
      setFilteredLicenses(enrichedData);
      setTotalPages(res.data.totalPages);
      setPage(res.data.number);
    } catch (error) {
      console.error("Fetch Licenses Error:", error);
      toast.error("❌ Failed to load licenses.");
    }
  };

  useEffect(() => {
    fetchLicenses(0);
  }, []);

  // ✅ Filter licenses
  const handleFilter = (term) => {
    setSearchTerm(term);

    if (!term.trim()) return setFilteredLicenses(licenses);

    const filtered = licenses.filter((l) =>
      l.licenseKey.toLowerCase().includes(term.toLowerCase()) ||
      l.softwareName.toLowerCase().includes(term.toLowerCase()) ||
      l.vendor?.vendorName?.toLowerCase().includes(term.toLowerCase())
    );

    setFilteredLicenses(filtered);
  };

  // ✅ Add & Edit Form Permissions
  const handleAddClick = () => {
    if (!canManage) {
      toast.error("🚫 You do not have permission to add a license.");
      return;
    }
    setEditingLicense(null);
    setShowForm(true);
  };

  const handleEdit = (license) => {
    if (!canManage) {
      toast.error("🚫 You do not have permission to edit licenses.");
      return;
    }
    setEditingLicense(license);
    setShowForm(true);
  };

  // ✅ Close Popup Form
  const closeForm = () => {
    setEditingLicense(null);
    setShowForm(false);
  };

  // ✅ Pagination Controls
  const handlePrev = () => page > 0 && fetchLicenses(page - 1);
  const handleNext = () => page < totalPages - 1 && fetchLicenses(page + 1);

  // ✅ CSV Export
  const exportCSV = () => {
    if (filteredLicenses.length === 0) {
      toast.info("No license data to export.");
      return;
    }

    const headers = [
      "License Key",
      "Software Name",
      "Vendor ID",
      "Valid From",
      "Valid To",
      "License Type",
      "Max Usage",
      "Assigned Count",
    ];

    const rows = filteredLicenses.map((l) => [
      l.licenseKey,
      l.softwareName,
      l.vendorId || "-",
      l.validFrom,
      l.validTo,
      l.licenseType,
      l.maxUsage,
      l.assignedCount || 0,
    ]);

    const csvContent =
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Licenses.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("📁 CSV exported successfully!");
  };

  // ✅ PDF Export
  const exportPDF = () => {
    try {
      if (filteredLicenses.length === 0) {
        toast.info("No license data to export.");
        return;
      }

      const doc = new jsPDF("p", "mm", "a4");
      doc.setFontSize(18);
      doc.text("License Report", 14, 15);

      autoTable(doc, {
        startY: 25,
        head: [[
          "License Key",
          "Software Name",
          "Vendor ID",
          "Valid From",
          "Valid To",
          "Type",
          "Max Usage",
          "Assigned Count",
        ]],
        body: filteredLicenses.map((l) => [
          l.licenseKey,
          l.softwareName,
          l.vendorId || "-",
          l.validFrom,
          l.validTo,
          l.licenseType,
          l.maxUsage,
          l.assignedCount || 0,
        ]),
        styles: { fontSize: 9 },
        theme: "grid"
      });

      doc.save("Licenses.pdf");
      toast.success("📄 PDF exported successfully!");
    } catch {
      toast.error("❌ PDF export failed.");
    }
  };

  return (
    <div className="license-container">
      <h1>License Management</h1>

      {/* ✅ Filter & Export Buttons */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by License Key, Software, Vendor Name..."
          value={searchTerm}
          onChange={(e) => handleFilter(e.target.value)}
        />

        <div className="btn-group">
          <button
            className="btn-add"
            onClick={handleAddClick}
            disabled={!canManage}
            style={!canManage ? { opacity: 0.4, cursor: "not-allowed" } : {}}
          >
            + Add License
          </button>
          <button className="btn-export" onClick={exportCSV}>
            ⬇ Export CSV
          </button>
          <button className="btn-export" onClick={exportPDF}>
            🧾 Export PDF
          </button>
        </div>
      </div>

      {/* ✅ Popup Form */}
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

      {/* ✅ License Table */}
      <LicenseList
        licenses={filteredLicenses}
        handleEdit={handleEdit}
        handleDelete={async (key) => {
          if (!canManage)
            return toast.error("🚫 You do not have permission to delete.");

          if (!window.confirm("🗑️ Are you sure you want to delete this license?"))
            return;

          try {
            await api.delete(`/licenses/${key}`);
            toast.success("✅ License deleted!");
            fetchLicenses(page);
          } catch {
            toast.error("❌ Delete failed!");
          }
        }}
      />

      {/* ✅ Pagination */}
      <div className="pagination">
        <button onClick={handlePrev} disabled={page === 0}>
          ◀ Previous
        </button>
        <span>Page {page + 1} of {totalPages}</span>
        <button onClick={handleNext} disabled={page >= totalPages - 1}>
          Next ▶
        </button>
      </div>
    </div>
  );
}
