// src/components/licenses/LicenseList.jsx
import React from "react";
import "./LicenseManagement.css";

export default function LicenseList({ licenses, handleEdit, handleDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-lg rounded-xl overflow-hidden">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-3 text-left">License Key</th>
            <th className="px-4 py-3 text-left">Software</th>
            <th className="px-4 py-3 text-left">Vendor</th>
            <th className="px-4 py-3 text-left">Valid From</th>
            <th className="px-4 py-3 text-left">Valid To</th>
            <th className="px-4 py-3 text-left">Type</th>
            <th className="px-4 py-3 text-left">Max Usage</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {licenses.length > 0 ? (
            licenses.map((l) => (
              <tr key={l.licenseKey} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{l.licenseKey}</td>
                <td className="px-4 py-3">{l.softwareName}</td>
                <td className="px-4 py-3">{l.vendor?.vendorName}</td>
                <td className="px-4 py-3">{l.validFrom}</td>
                <td className="px-4 py-3">{l.validTo}</td>
                <td className="px-4 py-3">{l.licenseType}</td>
                <td className="px-4 py-3">{l.maxUsage}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(l)}
                    className="bg-yellow-400 text-white px-3 py-1 rounded-lg hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(l.licenseKey)}
                    className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center text-gray-500 py-6">
                No licenses found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
