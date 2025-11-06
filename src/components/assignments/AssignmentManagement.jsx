// src/components/assignments/AssignmentManagement.jsx
import React, { useContext, useEffect, useState } from "react";
import api from "../../services/api";
import AssignmentForm from "./AssignmentForm";
import AssignmentList from "./AssignmentList";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "./AssignmentManagement.css";
import { AuthContext } from "../../context/AuthContext"; // ✅ Role-based access

export default function AssignmentManagement() {
  const { canManage } = useContext(AuthContext); // ✅ Permission

  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [page, setPage] = useState(0);
  const size = 5;
  const [totalPages, setTotalPages] = useState(0);

  const fetchAssignments = async (pageNumber = page) => {
    try {
      const res = await api.get(
        `/assignments/page?page=${pageNumber}&size=${size}`
      );
      setAssignments(res.data.content || []);
      setFilteredAssignments(res.data.content || []);
      setTotalPages(res.data.totalPages);
      setPage(pageNumber);
    } catch (error) {
      toast.error("❌ Unable to fetch assignments");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAssignments(0);
  }, []);

  const fetchAllAssignments = async () => {
    const res = await api.get("/assignments");
    return res.data;
  };

  /* ✅ Export CSV */
  const exportCSV = async () => {
    const all = await fetchAllAssignments();
    const csvContent = [
      ["Assignment ID", "License Key", "Software", "Device", "Assigned On", "Revoked On"],
      ...all.map((a) => [
        a.assignmentId,
        a.licenseKey,
        a.softwareName,
        a.deviceId,
        a.assignedOn,
        a.revokedOn || "Active",
      ]),
    ].map((r) => r.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "Assignment_Report.csv";
    a.click();

    toast.success("✅ CSV Exported!");
  };

  /* ✅ Export PDF */
  const exportPDF = async () => {
    const all = await fetchAllAssignments();
    const doc = new jsPDF("landscape");
    doc.text("License Assignment Report", 14, 12);

    autoTable(doc, {
      startY: 18,
      head: [["ID", "License Key", "Software", "Device", "Assigned On", "Revoked On"]],
      body: all.map((a) => [
        a.assignmentId,
        a.licenseKey,
        a.softwareName,
        a.deviceId,
        a.assignedOn,
        a.revokedOn || "Active",
      ]),
      theme: "grid",
    });

    doc.save("Assignment_Report.pdf");
    toast.success("📄 PDF Exported!");
  };

  /* ✅ Search/Filter */
  const handleFilter = (term) => {
    setSearchTerm(term);
    if (!term.trim()) return setFilteredAssignments(assignments);

    const txt = term.toLowerCase();
    setFilteredAssignments(
      assignments.filter(
        (a) =>
          a.licenseKey.toLowerCase().includes(txt) ||
          a.softwareName.toLowerCase().includes(txt) ||
          a.deviceId.toLowerCase().includes(txt)
      )
    );
  };

  /* ✅ Restricted: Assign only if allowed */
  const handleAddClick = () => {
    if (!canManage) return toast.warn("🔒 View-only access for Auditor");
    setEditingAssignment(null);
    setShowForm(true);
  };

  const handleEdit = (assignment) => {
    if (!canManage) return toast.warn("🔒 Edit restricted — Auditor mode");
    setEditingAssignment(assignment);
    setShowForm(true);
  };

  const closeForm = () => {
    setEditingAssignment(null);
    setShowForm(false);
  };

  /* ✅ Pagination */
  const handlePrev = () => page > 0 && fetchAssignments(page - 1);
  const handleNext = () =>
    page < totalPages - 1 && fetchAssignments(page + 1);

  return (
    <div className="assignment-container">
      <h1>License Assignments</h1>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by License, Software or Device..."
          value={searchTerm}
          onChange={(e) => handleFilter(e.target.value)}
        />

        <div className="action-buttons">
          <button
            className="btn-add"
            onClick={handleAddClick}
            disabled={!canManage}
            style={!canManage ? { opacity: 0.4, cursor: "not-allowed" } : {}}
          >
            + Assign License
          </button>

          <button className="btn-export" onClick={exportCSV}>
            Export CSV
          </button>
          <button className="btn-export" onClick={exportPDF}>
            Export PDF
          </button>
        </div>
      </div>

      {showForm && (
        <AssignmentForm
          fetchAssignments={() => fetchAssignments(page)}
          editingAssignment={editingAssignment}
          setEditingAssignment={setEditingAssignment}
          closeForm={closeForm}
        />
      )}

      {/* ✅ RBAC-aware list control */}
      <AssignmentList
        assignments={filteredAssignments}
        onEdit={handleEdit}
        fetchAssignments={() => fetchAssignments(page)}
        canManage={canManage} // ✅ Pass RBAC control
      />

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
