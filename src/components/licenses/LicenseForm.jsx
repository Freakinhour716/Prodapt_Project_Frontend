import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LicenseManagement.css";

export default function LicenseForm({
  fetchLicenses,
  editingLicense,
  setEditingLicense,
  closeForm,
}) {
  const [license, setLicense] = useState({
    licenseKey: "",
    softwareName: "",
    vendorId: "",
    validFrom: "",
    validTo: "",
    licenseType: "PER_DEVICE",
    maxUsage: "",
    notes: "",
  });

  useEffect(() => {
    if (editingLicense) {
      setLicense(editingLicense);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [editingLicense]);

  const handleChange = (e) => {
    setLicense({ ...license, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLicense) {
        await api.put(`/licenses/${license.licenseKey}`, license);
        toast.success("✅ License updated successfully!");
      } else {
        await api.post("/licenses", license);
        toast.success("✅ License added successfully!");
      }

      fetchLicenses();
      closeForm();
      setEditingLicense(null);

    } catch (err) {
      console.error("Save failed:", err);
      toast.error("❌ Failed to save license!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="license-form">
      <h2 className="full-row">{editingLicense ? "Edit License" : "Add License"}</h2>

      <input type="text" name="licenseKey" placeholder="License Key"
        value={license.licenseKey} onChange={handleChange} required
        disabled={!!editingLicense} />

      <input type="text" name="softwareName" placeholder="Software Name"
        value={license.softwareName} onChange={handleChange} required />

      <input type="number" name="vendorId" placeholder="Vendor ID"
        value={license.vendorId} onChange={handleChange} required />

      <input type="date" name="validFrom"
        value={license.validFrom || ""} onChange={handleChange} />

      <input type="date" name="validTo"
        value={license.validTo || ""} onChange={handleChange} />

      <select name="licenseType" value={license.licenseType} onChange={handleChange}>
        <option value="PER_DEVICE">Per Device</option>
        <option value="PER_USER">Per User</option>
        <option value="ENTERPRISE">Enterprise</option>
      </select>

      <input type="number" name="maxUsage"
        placeholder="Max Usage" value={license.maxUsage}
        onChange={handleChange} />

      <textarea name="notes" placeholder="Notes"
        value={license.notes} onChange={handleChange} />

      <div className="actions full-row">
        <button type="submit">{editingLicense ? "Update" : "Add"}</button>
        <button type="button" onClick={closeForm}>Cancel</button>
      </div>
    </form>
  );
}
