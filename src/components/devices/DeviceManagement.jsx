// // src/pages/DeviceManagement.jsx
// import React, { useEffect, useState } from "react";
// import api from "../../services/api"; // use your centralized axios instance
// import DeviceForm from "./DeviceForm";
// import DeviceList from "./DeviceList";
// import "./DeviceManagement.css"

// const DeviceManagement = () => {
//   const [devices, setDevices] = useState([]);
//   const [editingDevice, setEditingDevice] = useState(null);

//   // Fetch all devices
//   const fetchDevices = async () => {
//     try {
//       const res = await api.get("/devices");
//       setDevices(res.data);
//     } catch (error) {
//       console.error("Error fetching devices:", error);
//     }
//   };

//   // Load devices on component mount
//   useEffect(() => {
//     fetchDevices();
//   }, []);

//   return (
//     <div className="device-container" style={{ padding: "20px" }}>
//       <h1>Device Management</h1>
//       <DeviceForm
//         fetchDevices={fetchDevices}
//         editingDevice={editingDevice}
//         setEditingDevice={setEditingDevice}
//       />
//       <hr style={{ margin: "20px 0" }} />
//       <DeviceList
//         devices={devices}
//         fetchDevices={fetchDevices}
//         setEditingDevice={setEditingDevice}
//       />
//     </div>
//   );
// };

// export default DeviceManagement;

import React, { useEffect, useState } from "react";
import api from "../../services/api";
import DeviceForm from "./DeviceForm";
import DeviceList from "./DeviceList";
import "./DeviceManagement.css";

const DeviceManagement = () => {
  const [devices, setDevices] = useState([]);
  const [editingDevice, setEditingDevice] = useState(null);

  // 🔹 Pagination State
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(4);
  const [totalPages, setTotalPages] = useState(0);

  const fetchDevices = async (pageNumber = page) => {
    try {
      const res = await api.get(`/devices/page?page=${pageNumber}&size=${size}`);
      setDevices(res.data.content);
      setTotalPages(res.data.totalPages);
      setPage(pageNumber);
    } catch (error) {
      console.error("Error fetching devices:", error);
      alert("❌ Unable to fetch devices from server");
    }
  };

  useEffect(() => {
    fetchDevices(0);
  }, []);

  // 🔹 Pagination Handlers
  const handleNext = () => {
    if (page < totalPages - 1) fetchDevices(page + 1);
  };

  const handlePrev = () => {
    if (page > 0) fetchDevices(page - 1);
  };

  return (
    <div className="device-container">
      <h1>Device Management</h1>

      <DeviceForm
        fetchDevices={() => fetchDevices(page)} // refresh current page
        editingDevice={editingDevice}
        setEditingDevice={setEditingDevice}
      />

      <hr style={{ margin: "24px 0", borderColor: "rgba(255,255,255,0.1)" }} />

      <DeviceList
        devices={devices}
        fetchDevices={() => fetchDevices(page)}
        setEditingDevice={setEditingDevice}
      />

      {/* 🔹 Pagination Controls */}
      <div className="pagination">
        <button onClick={handlePrev} disabled={page === 0}>
          ◀ Previous
        </button>

        <span>
          Page {page + 1} of {totalPages}
        </span>

        <button onClick={handleNext} disabled={page >= totalPages - 1}>
          Next ▶
        </button>
      </div>
    </div>
  );
};

export default DeviceManagement;

