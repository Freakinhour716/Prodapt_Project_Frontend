// src/components/licenses/LicenseForm.jsx
import React from "react";
import "./LicenseManagement.css";

export default function LicenseForm({
  license,
  editingLicense,
  handleChange,
  handleSubmit,
  resetForm,
}) {
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-md mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <input
        type="text"
        name="licenseKey"
        placeholder="License Key"
        value={license.licenseKey}
        onChange={handleChange}
        className="border border-gray-300 px-3 py-2 rounded-lg"
        required
        disabled={!!editingLicense}
      />
      <input
        type="text"
        name="softwareName"
        placeholder="Software Name"
        value={license.softwareName}
        onChange={handleChange}
        className="border border-gray-300 px-3 py-2 rounded-lg"
        required
      />
      <input
        type="number"
        name="vendor.vendorId"
        placeholder="Vendor ID"
        value={license.vendor.vendorId}
        onChange={handleChange}
        className="border border-gray-300 px-3 py-2 rounded-lg"
        required
      />
      <input
        type="text"
        name="vendor.vendorName"
        placeholder="Vendor Name"
        value={license.vendor.vendorName}
        onChange={handleChange}
        className="border border-gray-300 px-3 py-2 rounded-lg"
        required
      />
      <input
        type="date"
        name="validFrom"
        value={license.validFrom}
        onChange={handleChange}
        className="border border-gray-300 px-3 py-2 rounded-lg"
      />
      <input
        type="date"
        name="validTo"
        value={license.validTo}
        onChange={handleChange}
        className="border border-gray-300 px-3 py-2 rounded-lg"
      />
      <select
        name="licenseType"
        value={license.licenseType}
        onChange={handleChange}
        className="border border-gray-300 px-3 py-2 rounded-lg"
      >
        <option value="PER_DEVICE">Per Device</option>
        <option value="PER_USER">Per User</option>
        <option value="ENTERPRISE">Enterprise</option>
      </select>
      <input
        type="number"
        name="maxUsage"
        placeholder="Max Usage"
        value={license.maxUsage}
        onChange={handleChange}
        className="border border-gray-300 px-3 py-2 rounded-lg"
      />
      <textarea
        name="notes"
        placeholder="Notes"
        value={license.notes}
        onChange={handleChange}
        className="border border-gray-300 px-3 py-2 rounded-lg md:col-span-2"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 md:col-span-2"
      >
        {editingLicense ? "Update License" : "Add License"}
      </button>
    </form>
  );
}
