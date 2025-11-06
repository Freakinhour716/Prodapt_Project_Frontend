// src/components/licenses/LicenseList.jsx
import React from "react";
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
            <th>Usage</th> {/* ✅ Progress Bar Column */}
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {licenses.map((l) => {
            const assigned = l.assignedCount || 0;
            const max = l.maxUsage || 1;
            const percentage = Math.min(Math.round((assigned / max) * 100), 100);

            return (
              <tr key={l.licenseKey}>
                <td>{l.licenseKey}</td>
                <td>{l.softwareName}</td>
                <td>{l.vendor?.vendorName || "N/A"}</td>
                <td>{l.validFrom}</td>
                <td>{l.validTo}</td>
                <td>{l.licenseType}</td>
                <td>{max}</td>

                {/* ✅ Enhanced Usage Bar */}
                <td className="usage-column">
                  <div className="usage-bar">
                    <div
                      className={`usage-fill ${
  percentage < 60 ? "success" :
  percentage < 85 ? "warn" :
  "danger"
}`}

                      style={{ width: `${percentage}%` }}
                    >
                      <span className="usage-text">
                        {percentage}% ({assigned}/{max})
                      </span>
                    </div>
                  </div>
                </td>

                <td>{l.notes || "-"}</td>

                <td className="license-actions">
                  <button className="btn-edit" onClick={() => handleEdit(l)}>
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(l.licenseKey)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
