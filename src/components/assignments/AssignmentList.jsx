// src/components/assignments/AssignmentList.jsx
import React from "react";
import { toast } from "react-toastify";
import api from "../../services/api";
import "./AssignmentManagement.css";

export default function AssignmentList({
  assignments,
  fetchAssignments,
  onEdit,
  canManage
}) {
  const handleDelete = async (id) => {
    if (!canManage) {
      return toast.warn("🔒 View-only access (Auditor)");
    }

    if (!window.confirm("Remove this assignment?")) return;

    try {
      await api.delete(`/assignments/${id}`);
      fetchAssignments();
      toast.success("✅ Assignment removed");
    } catch (err) {
      toast.error("❌ Delete failed");
      console.error(err);
    }
  };

  return (
    <div className="assignment-list">
      <table>
        <thead>
          <tr>
            <th>License</th>
            <th>Software</th>
            <th>Assigned To (Device)</th>
            <th>Assigned On</th>
            <th>Revoked On</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {assignments.map((a) => (
            <tr key={a.assignmentId}>
              <td>{a.licenseKey}</td>
              <td>{a.softwareName}</td>
              <td>{a.deviceId}</td>
              <td>{a.assignedOn}</td>
              <td>{a.revokedOn ?? "Active"}</td>

              <td className="actions-col">
                <button
                  className="btn-edit"
                  disabled={!canManage}
                  style={!canManage ? { opacity: 0.4, cursor: "not-allowed" } : {}}
                  onClick={() =>
                    canManage
                      ? onEdit(a)
                      : toast.warn("🔒 Auditor mode — Edit restricted")
                  }
                >
                  Edit
                </button>

                <button
                  className="btn-delete"
                  disabled={!canManage}
                  style={!canManage ? { opacity: 0.4, cursor: "not-allowed" } : {}}
                  onClick={() => handleDelete(a.assignmentId)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}
