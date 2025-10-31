// // src/components/devices/DeviceForm.jsx
// import { useState, useEffect } from "react";
// import api from "../../services/api";

// export default function DeviceForm({ fetchDevices, editingDevice, setEditingDevice }) {
//   const [device, setDevice] = useState({
//     deviceId: "",
//     type: "",
//     ipAddress: "",
//     location: "",
//     model: "",
//     status: "ACTIVE",
//   });

//   useEffect(() => {
//     if (editingDevice) setDevice(editingDevice);
//   }, [editingDevice]);

//   const handleChange = (e) => {
//     setDevice({ ...device, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       console.log("Submitting device data:", device); // 👈 Debug log

//       if (editingDevice) {
//         await api.put(`/devices/${device.deviceId}`, device);
//         alert("✅ Device updated successfully");
//       } else {
//         await api.post("/devices", device);
//         alert("✅ Device added successfully");
//       }

//       setEditingDevice(null);
//       setDevice({
//         deviceId: "",
//         type: "",
//         ipAddress: "",
//         location: "",
//         model: "",
//         status: "ACTIVE",
//       });
//       fetchDevices();
//     } catch (err) {
//       console.error("❌ Device save error:", err.response || err);
//       if (err.response) {
//         alert(`❌ Failed: ${err.response.status} - ${err.response.data.message || "Backend error"}`);
//       } else {
//         alert("❌ Failed to connect to server");
//       }
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="device-form">
//       <h2>{editingDevice ? "Edit Device" : "Add Device"}</h2>

//       <input
//         type="text"
//         name="deviceId"
//         placeholder="Device ID"
//         value={device.deviceId}
//         onChange={handleChange}
//         required
//       />

//       <input
//         type="text"
//         name="type"
//         placeholder="Device Type"
//         value={device.type}
//         onChange={handleChange}
//         required
//       />

//       <input
//         type="text"
//         name="ipAddress"
//         placeholder="IP Address"
//         value={device.ipAddress}
//         onChange={handleChange}
//         required
//       />

//       <input
//         type="text"
//         name="location"
//         placeholder="Location"
//         value={device.location}
//         onChange={handleChange}
//       />

//       <input
//         type="text"
//         name="model"
//         placeholder="Model"
//         value={device.model}
//         onChange={handleChange}
//       />

//       <select name="status" value={device.status} onChange={handleChange}>
//         <option value="ACTIVE">ACTIVE</option>
//         <option value="MAINTENANCE">MAINTENANCE</option>
//         <option value="OBSOLETE">OBSOLETE</option>
//         <option value="DECOMMISSIONED">DECOMMISSIONED</option>
//       </select>

//       <button type="submit">{editingDevice ? "Update" : "Add"}</button>
//       {editingDevice && (
//         <button type="button" onClick={() => setEditingDevice(null)}>
//           Cancel
//         </button>
//       )}
//     </form>
//   );
// }
import { useState, useEffect } from "react";
import api from "../../services/api";

export default function DeviceForm({ fetchDevices, editingDevice, setEditingDevice }) {
  const [device, setDevice] = useState({
    deviceId: "",
    type: "",
    ipAddress: "",
    location: "",
    model: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    if (editingDevice) setDevice(editingDevice);
  }, [editingDevice]);

  const handleChange = (e) => {
    setDevice({ ...device, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting device data:", device);

      if (editingDevice) {
        await api.put(`/api/devices/${device.deviceId}`, device);
        alert("✅ Device updated successfully");
      } else {
        await api.post("/api/devices", device);
        alert("✅ Device added successfully");
      }

      setEditingDevice(null);
      setDevice({
        deviceId: "",
        type: "",
        ipAddress: "",
        location: "",
        model: "",
        status: "ACTIVE",
      });
      fetchDevices();
    } catch (err) {
      console.error("❌ Device save error:", err.response || err);
      if (err.response) {
        alert(`❌ Failed: ${err.response.status} - ${err.response.data.message || "Backend error"}`);
      } else {
        alert("❌ Failed to connect to server");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="device-form">
      <h2>{editingDevice ? "Edit Device" : "Add Device"}</h2>

      <input
        type="text"
        name="deviceId"
        placeholder="Device ID"
        value={device.deviceId}
        onChange={handleChange}
        required
        disabled={!!editingDevice} // prevent changing ID during edit
      />

      <input
        type="text"
        name="type"
        placeholder="Device Type"
        value={device.type}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="ipAddress"
        placeholder="IP Address"
        value={device.ipAddress}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="location"
        placeholder="Location"
        value={device.location}
        onChange={handleChange}
      />

      <input
        type="text"
        name="model"
        placeholder="Model"
        value={device.model}
        onChange={handleChange}
      />

      <select name="status" value={device.status} onChange={handleChange}>
        <option value="ACTIVE">ACTIVE</option>
        <option value="MAINTENANCE">MAINTENANCE</option>
        <option value="OBSOLETE">OBSOLETE</option>
        <option value="DECOMMISSIONED">DECOMMISSIONED</option>
      </select>

      <div className="actions">
        <button type="submit">{editingDevice ? "Update" : "Add"}</button>
        {editingDevice && (
          <button type="button" onClick={() => setEditingDevice(null)}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
