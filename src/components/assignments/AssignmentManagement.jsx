import React, { useEffect, useState } from "react";
import api from "../../services/api";
import AssignmentForm from "./AssignmentForm";
import AssignmentList from "./AssignmentList";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AssignmentManagement.css";

export default function AssignmentManagement() {
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // ✅ Pagination
  const [page, setPage] = useState(0);
  const size = 5;
  const [totalPages, setTotalPages] = useState(0);

//   const fetchAssignments = async (pageNumber = page) => {
//     try {
//       const res = await api.get(`/assignments/page?page=${pageNumber}&size=${size}`);
//       setAssignments(res.data.content);
//       setFilteredAssignments(res.data.content);
//       setTotalPages(res.data.totalPages);
//       setPage(pageNumber);
//     } catch (error) {
//       toast.error("❌ Failed to fetch assignments!");
//       console.error("Fetch error:", error);
//     }
//   };

const fetchAssignments = async (pageNumber = page) => {
  try {
    const res = await api.get(`/assignments/page?page=${pageNumber}&size=${size}`);

    setAssignments(res.data.content);
    setFilteredAssignments(res.data.content);
    setTotalPages(res.data.totalPages);
    setPage(pageNumber);

  } catch (error) {
    toast.error("❌ Failed to fetch assignments!");
    console.error("Fetch error:", error);
  }
};

  useEffect(() => {
    fetchAssignments(0);
  }, []);

  const handleFilter = (term) => {
    setSearchTerm(term);
    if (!term.trim()) return setFilteredAssignments(assignments);

    const filtered = assignments.filter((a) =>
      a.licenseKey.toLowerCase().includes(term.toLowerCase()) ||
      a.softwareName.toLowerCase().includes(term.toLowerCase()) ||
      a.deviceId.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredAssignments(filtered);
  };

  const handleAddClick = () => {
    setEditingAssignment(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeForm = () => {
    setEditingAssignment(null);
    setShowForm(false);
  };

  const handleNext = () => page < totalPages - 1 && fetchAssignments(page + 1);
  const handlePrev = () => page > 0 && fetchAssignments(page - 1);

  return (
    <div className="assignment-container">
      <h1>License Assignment</h1>

      {/* Search + Add Bar */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by License, Software or Device..."
          value={searchTerm}
          onChange={(e) => handleFilter(e.target.value)}
        />

        <button className="btn-add" onClick={handleAddClick}>
          + Assign License
        </button>
      </div>

      {showForm && (
        <AssignmentForm
          fetchAssignments={() => fetchAssignments(page)}
          editingAssignment={editingAssignment}
          setEditingAssignment={setEditingAssignment}
          closeForm={closeForm}
        />
      )}

      {/* List */}
      <AssignmentList
        assignments={filteredAssignments}
        setEditingAssignment={handleEdit}
        fetchAssignments={() => fetchAssignments(page)}
      />

      {/* Pagination */}
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
