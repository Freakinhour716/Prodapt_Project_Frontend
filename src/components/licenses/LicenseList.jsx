// src/components/licenses/LicenseList.jsx
import React from "react";
import "./LicenseManagement.css";

export default function LicenseList({ licenses, handleEdit, handleDelete }) {
  return (
    <div className="license-list-container">
      <table className="license-table">
        <thead>
          <tr>
            <th>License Key</th>
            <th>Software</th>
            <th>Vendor</th>
            <th>Valid From</th>
            <th>Valid To</th>
            <th>Type</th>
            <th>Max Usage</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {licenses.length > 0 ? (
            licenses.map((l) => (
              <tr key={l.licenseKey}>
                <td>{l.licenseKey}</td>
                <td>{l.softwareName}</td>
                <td>{l.vendor?.vendorName}</td>
                <td>{l.validFrom}</td>
                <td>{l.validTo}</td>
                <td>{l.licenseType}</td>
                <td>{l.maxUsage}</td>
                <td className="license-actions">
                  <button
                    onClick={() => handleEdit(l)}
                    className="btn-edit"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(l.licenseKey)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="no-data">
                No licenses found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
