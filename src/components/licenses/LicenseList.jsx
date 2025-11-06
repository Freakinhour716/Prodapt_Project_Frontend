// src/components/licenses/LicenseList.jsx
import React from "react";
import { toast } from "react-toastify";
import api from "../../services/api";
import "./LicenseManagement.css";

export default function LicenseList({ licenses, handleEdit, handleDelete }) {
  return (
    <div className="license-list">
      <table>
        <thead>
          <tr>
            <th>License Key</th>
            <th>Software</th>
            <th>Vendor</th>
            <th>Valid From</th>
            <th>Valid To</th>
            <th>Type</th>
            <th>Max Usage</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {licenses.map((l) => (
            <tr key={l.licenseKey}>
              <td>{l.licenseKey}</td>
              <td>{l.softwareName}</td>
              <td>{l.vendor?.vendorName || "N/A"}</td>
              <td>{l.validFrom}</td>
              <td>{l.validTo}</td>
              <td>{l.licenseType}</td>
              <td>{l.maxUsage}</td>
              <td>{l.notes || "-"}</td>

              <td className="license-actions">
                <button
                  className="btn-edit"
                  onClick={() => handleEdit(l)} // Passing the license to be edited
                >
                  Edit
                </button>

                <button
                  className="btn-delete"
                  onClick={() => handleDelete(l.licenseKey)} // Handling deletion
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
