// import React from "react";
// import { useNavigate } from "react-router-dom";

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const role = localStorage.getItem("role");

//   const handleViewDevices = () => navigate("/devices");
//   const handleAddDevice = () => navigate("/devices");

//   return (
//     <div className="p-8">
//       <h1 className="text-3xl font-bold mb-6">Welcome, {role}</h1>

//       {/* Role-specific dashboard cards */}
//       {role === "ADMIN" && (
//         <div className="grid gap-4 md:grid-cols-2">
//           <div className="p-6 rounded-2xl shadow-lg bg-white">
//             <h2 className="text-xl font-semibold mb-2">Manage Devices</h2>
//             <p className="text-gray-600 mb-4">
//               Add, update, or remove devices from the system.
//             </p>
//             <button
//               onClick={handleAddDevice}
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//             >
//               Go to Device Management
//             </button>
//           </div>

//           <div className="p-6 rounded-2xl shadow-lg bg-white">
//             <h2 className="text-xl font-semibold mb-2">User Overview</h2>
//             <p className="text-gray-600 mb-4">
//               Monitor engineers and auditors' activity logs.
//             </p>
//             <button className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300">
//               View Reports
//             </button>
//           </div>
//         </div>
//       )}

//       {role === "ENGINEER" && (
//         <div className="grid gap-4 md:grid-cols-2">
//           <div className="p-6 rounded-2xl shadow-lg bg-white">
//             <h2 className="text-xl font-semibold mb-2">Your Devices</h2>
//             <p className="text-gray-600 mb-4">
//               Add and manage devices assigned to you.
//             </p>
//             <button
//               onClick={handleViewDevices}
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//             >
//               Manage Devices
//             </button>
//           </div>

//           <div className="p-6 rounded-2xl shadow-lg bg-white">
//             <h2 className="text-xl font-semibold mb-2">Performance Logs</h2>
//             <p className="text-gray-600 mb-4">
//               Track system health and recent updates.
//             </p>
//             <button className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300">
//               View Logs
//             </button>
//           </div>
//         </div>
//       )}

//       {role === "AUDITOR" && (
//         <div className="grid gap-4 md:grid-cols-2">
//           <div className="p-6 rounded-2xl shadow-lg bg-white">
//             <h2 className="text-xl font-semibold mb-2">Device Overview</h2>
//             <p className="text-gray-600 mb-4">
//               Review device configurations and compliance reports.
//             </p>
//             <button
//               onClick={handleViewDevices}
//               className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
//             >
//               View Devices
//             </button>
//           </div>

//           <div className="p-6 rounded-2xl shadow-lg bg-white">
//             <h2 className="text-xl font-semibold mb-2">Audit Reports</h2>
//             <p className="text-gray-600 mb-4">
//               Access generated reports and system audits.
//             </p>
//             <button className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300">
//               View Reports
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;


// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer
} from "recharts";
import "./Dashboard.css";

export default function Dashboard() {
  const [deviceCount, setDeviceCount] = useState(0);
  const [licenseCount, setLicenseCount] = useState(0);
  const [assignmentCount, setAssignmentCount] = useState(0);
  const [deviceStatusData, setDeviceStatusData] = useState([]);
  const [licenseTypeData, setLicenseTypeData] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  // const loadDashboardData = async () => {
  //   try {
  //     const [deviceRes, licenseRes, assignRes] = await Promise.all([
  //       api.get("/devices"),
  //       api.get("/licenses"),
  //       api.get("/api/assignments")
  //     ]);

  //     setDeviceCount(deviceRes.data.length);
  //     setLicenseCount(licenseRes.data.length);
  //     setAssignmentCount(assignRes.data.length);

  //     prepareDeviceStatusChart(deviceRes.data);
  //     prepareLicenseTypeChart(licenseRes.data);

  //   } catch (err) {
  //     console.error("Dashboard fetch error:", err);
  //   }
  // };

  const loadDashboardData = async () => {
  try {
    const [
      deviceRes,
      licenseRes,
      assignmentRes
    ] = await Promise.all([
      api.get("/devices/page?page=0&size=1"),
      api.get("/licenses"),
      api.get("/assignments/page?page=0&size=1")
    ]);

    // ✅ Dynamic Count using pageable metadata
    setDeviceCount(deviceRes.data.totalElements);
    setLicenseCount(licenseRes.data.length);
    setAssignmentCount(assignmentRes.data.totalElements);

    // ✅ Fetch full lists for chart breakdowns (only status/type fields)
    const [devicesFullRes, licensesFullRes] = await Promise.all([
      api.get("/devices"),
      api.get("/licenses")
    ]);

    prepareDeviceStatusChart(devicesFullRes.data);
    prepareLicenseTypeChart(licensesFullRes.data);

  } catch (err) {
    console.error("Dashboard fetch error:", err);
  }
};



  const prepareDeviceStatusChart = (devices) => {
    const statusMap = {};
    devices.forEach(d => {
      statusMap[d.status] = (statusMap[d.status] || 0) + 1;
    });

    const formattedData = Object.keys(statusMap).map(key => ({
      name: key,
      value: statusMap[key],
    }));

    setDeviceStatusData(formattedData);
  };

  const prepareLicenseTypeChart = (licenses) => {
    const typeMap = {};
    licenses.forEach(l => {
      typeMap[l.licenseType] = (typeMap[l.licenseType] || 0) + 1;
    });

    const formattedData = Object.keys(typeMap).map(key => ({
      name: key,
      value: typeMap[key],
    }));

    setLicenseTypeData(formattedData);
  };

  const COLORS = ["#60a5fa", "#34d399", "#fb7185", "#fbbf24", "#a78bfa"];

  return (
    <div className="dashboard-container">
      <h1>📊 IT Asset Dashboard</h1>

      <div className="stats-container">
        <div className="stat-card">
          <h2>{deviceCount}</h2>
          <p>Devices</p>
        </div>

        <div className="stat-card">
          <h2>{licenseCount}</h2>
          <p>Licenses</p>
        </div>

        <div className="stat-card">
          <h2>{assignmentCount}</h2>
          <p>Assignments</p>
        </div>
      </div>

      <div className="charts-area">
        <div className="chart-box">
          <h3>Device Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={deviceStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
              >
                {deviceStatusData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>License Type Usage</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={licenseTypeData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value">
                {licenseTypeData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
