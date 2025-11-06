// src/components/assignments/AssignmentForm.jsx
import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";

export default function AssignmentForm({ fetchAssignments, editingAssignment, setEditingAssignment, closeForm }) {
  const [assignment, setAssignment] = useState({
    licenseKey: "",
    deviceId: "",
    assignedOn: "",
    revokedOn: null,
  });

  const [licenses, setLicenses] = useState([]);
  const [devices, setDevices] = useState([]);

  const loadData = async () => {
    const resLic = await api.get("/licenses");
    const resDev = await api.get("/devices");
    setLicenses(resLic.data);
    setDevices(resDev.data);
  };

  useEffect(() => {
    loadData();
    if (editingAssignment) setAssignment(editingAssignment);
  }, [editingAssignment]);

  const handleChange = (e) => {
    setAssignment({ ...assignment, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAssignment) {
        await api.put(`/assignments/${assignment.assignmentId}`, assignment);
        toast.success("✅ Assignment updated!");
      } else {
        await api.post("/assignments", assignment, {
          headers: { "Content-Type": "application/json" },
        });
        toast.success("✅ License assigned!");
      }

      fetchAssignments();
      closeForm();
      setEditingAssignment(null);

    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to save assignment");
    }
  };

  return (
    <form className="assignment-form" onSubmit={handleSubmit}>
      <h2>{editingAssignment ? "Edit Assignment" : "Assign License"}</h2>

      <select name="licenseKey" value={assignment.licenseKey} onChange={handleChange}>
        <option value="">-- Select License --</option>
        {licenses.map((l) => (
          <option key={l.licenseKey} value={l.licenseKey}>
            {l.softwareName} ({l.licenseKey})
          </option>
        ))}
      </select>

      <select name="deviceId" value={assignment.deviceId} onChange={handleChange}>
        <option value="">-- Select Device --</option>
        {devices.map((d) => (
          <option key={d.deviceId} value={d.deviceId}>
            {d.deviceId} ({d.type})
          </option>
        ))}
      </select>

      <input type="date" name="assignedOn" value={assignment.assignedOn} onChange={handleChange} />

      <input type="date" name="revokedOn" value={assignment.revokedOn || ""} onChange={handleChange} />

      <div className="actions">
        <button type="submit">{editingAssignment ? "Update" : "Assign"}</button>
        <button type="button" onClick={closeForm}>Cancel</button>
      </div>
    </form>
  );
}
