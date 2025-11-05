// src/components/devices/DeviceForm.jsx
import { useState, useEffect } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import "./DeviceManagement.css"; // ensures popup + overlay styling

export default function DeviceForm({ fetchDevices, editingDevice, setEditingDevice, closeForm }) {
  const [device, setDevice] = useState({
    deviceId: "",
    type: "",
    ipAddress: "",
    location: "",
    model: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    if (editingDevice) {
      setDevice(editingDevice);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [editingDevice]);

  const handleChange = (e) => {
    setDevice({ ...device, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDevice) {
        await api.put(`/devices/${device.deviceId}`, device);
        toast.success("✅ Device updated successfully!");
      } else {
        await api.post("/devices", device);
        toast.success("✅ Device added successfully!");
      }

      fetchDevices();
      closeForm();

      setDevice({
        deviceId: "",
        type: "",
        ipAddress: "",
        location: "",
        model: "",
        status: "ACTIVE",
      });

    } catch (err) {
      console.error("Device save error:", err.response || err);
      toast.error("❌ Failed to save device!");
    }
  };

  return (
    <div className="overlay">
      <form onSubmit={handleSubmit} className="device-form popup">
        <h2>{editingDevice ? "Edit Device" : "Add Device"}</h2>

        <input type="text" name="deviceId" placeholder="Device ID"
          value={device.deviceId} onChange={handleChange}
          required disabled={!!editingDevice} />

        <input type="text" name="type" placeholder="Device Type"
          value={device.type} onChange={handleChange} required />

        <input type="text" name="ipAddress" placeholder="IP Address"
          value={device.ipAddress} onChange={handleChange} required />

        <input type="text" name="location" placeholder="Location"
          value={device.location} onChange={handleChange} />

        <input type="text" name="model" placeholder="Model"
          value={device.model} onChange={handleChange} />

        <select name="status" value={device.status} onChange={handleChange}>
          <option value="ACTIVE">ACTIVE</option>
          <option value="MAINTENANCE">MAINTENANCE</option>
          <option value="OBSOLETE">OBSOLETE</option>
          <option value="DECOMMISSIONED">DECOMMISSIONED</option>
        </select>

        <div className="actions">
          <button type="submit">{editingDevice ? "Update" : "Add"}</button>
          <button type="button" onClick={closeForm}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
