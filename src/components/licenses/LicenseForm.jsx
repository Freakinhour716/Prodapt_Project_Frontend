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
    <form onSubmit={handleSubmit} className="license-form">
      <input
        type="text"
        name="licenseKey"
        placeholder="License Key"
        value={license.licenseKey}
        onChange={handleChange}
        required
        disabled={!!editingLicense}
      />
      <input
        type="text"
        name="softwareName"
        placeholder="Software Name"
        value={license.softwareName}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="vendor.vendorId"
        placeholder="Vendor ID"
        value={license.vendor.vendorId}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="vendor.vendorName"
        placeholder="Vendor Name"
        value={license.vendor.vendorName}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="validFrom"
        value={license.validFrom}
        onChange={handleChange}
      />
      <input
        type="date"
        name="validTo"
        value={license.validTo}
        onChange={handleChange}
      />
      <select
        name="licenseType"
        value={license.licenseType}
        onChange={handleChange}
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
      />
      <textarea
        name="notes"
        placeholder="Notes"
        value={license.notes}
        onChange={handleChange}
      />
      <button type="submit">
        {editingLicense ? "Update License" : "Add License"}
      </button>
    </form>
  );
}
