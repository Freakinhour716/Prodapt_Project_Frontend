// src/components/assignments/AssignmentList.jsx
import React from "react";
import { toast } from "react-toastify";
import api from "../../services/api";

export default function AssignmentList({ assignments, fetchAssignments, handleEdit }) {

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this assignment?")) return;

    try {
      await api.delete(`/assignments/${id}`);
      fetchAssignments();
      toast.success("🗑️ Assignment removed");
    } catch (err) {
      toast.error("❌ Delete failed");
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
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {assignments.map((a) => (
            <tr key={a.assignmentId}>
              <td>{a.licenseKey}</td>
              <td>{a.softwareName}</td>
              <td>{a.deviceId}</td>
              <td>{a.assignedOn}</td>
              <td>{a.revokedOn ?? "-"}</td>

              <td className="actions">
                <button className="btn-edit" onClick={() => handleEdit(a)}>
                  Edit
                </button>
                <button className="btn-delete" onClick={() => handleDelete(a.assignmentId)}>
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
