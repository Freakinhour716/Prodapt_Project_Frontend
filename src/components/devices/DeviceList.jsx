// import React from "react";
// import api from "../../services/api";
// import "./DeviceManagement.css";

// const DeviceList = ({ devices, fetchDevices, setEditingDevice }) => {
//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this device?")) {
//       try {
//         await api.delete(`/devices/${id}`);
//         alert("🗑️ Device deleted successfully");
//         fetchDevices();
//       } catch (error) {
//         console.error(error);
//         alert("❌ Failed to delete device");
//       }
//     }
//   };

//   return (
//     <div className="device-list">
//       <h2>All Devices</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Type</th>
//             <th>IP Address</th>
//             <th>Location</th>
//             <th>Model</th>
//             <th>Status</th>
//             <th>Actions</th>
//           </tr>
//         </thead>

//         <tbody>
//           {devices.length > 0 ? (
//             devices.map((d) => (
//               <tr key={d.deviceId}>
//                 <td>{d.deviceId}</td>
//                 <td>{d.type}</td>
//                 <td>{d.ipAddress}</td>
//                 <td>{d.location}</td>
//                 <td>{d.model}</td>
//                 <td>
//                   <span className={`status ${String(d.status).toLowerCase()}`}>
//                     {d.status}
//                   </span>
//                 </td>
//                 <td>
//                   <button
//                     className="btn-edit"
//                     onClick={() => setEditingDevice(d)}
//                   >
//                     Edit
//                   </button>
//                   <button
//                     className="btn-delete"
//                     onClick={() => handleDelete(d.deviceId)}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="7" style={{ textAlign: "center", padding: "12px" }}>
//                 No devices found.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default DeviceList;
import React from "react";
import api from "../../services/api";
import "./DeviceManagement.css";

const DeviceList = ({ devices, fetchDevices, setEditingDevice }) => {
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this device?")) {
      try {
        await api.delete(`/api/devices/${id}`);
        alert("🗑️ Device deleted successfully");
        fetchDevices();
      } catch (error) {
        console.error("Delete failed:", error);
        alert("❌ Failed to delete device");
      }
    }
  };

  return (
    <div className="device-list">
      <h2>All Devices</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>IP Address</th>
            <th>Location</th>
            <th>Model</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {devices.length > 0 ? (
            devices.map((d) => (
              <tr key={d.deviceId}>
                <td>{d.deviceId}</td>
                <td>{d.type}</td>
                <td>{d.ipAddress}</td>
                <td>{d.location}</td>
                <td>{d.model}</td>
                <td>
                  <span className={`status ${String(d.status).toLowerCase()}`}>
                    {d.status}
                  </span>
                </td>
                <td>
                  <button className="btn-edit" onClick={() => setEditingDevice(d)}>
                    Edit
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(d.deviceId)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", padding: "12px" }}>
                No devices found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DeviceList;
