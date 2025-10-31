import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleViewDevices = () => navigate("/devices");
  const handleAddDevice = () => navigate("/devices");

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, {role}</h1>

      {/* Role-specific dashboard cards */}
      {role === "ADMIN" && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-6 rounded-2xl shadow-lg bg-white">
            <h2 className="text-xl font-semibold mb-2">Manage Devices</h2>
            <p className="text-gray-600 mb-4">
              Add, update, or remove devices from the system.
            </p>
            <button
              onClick={handleAddDevice}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Go to Device Management
            </button>
          </div>

          <div className="p-6 rounded-2xl shadow-lg bg-white">
            <h2 className="text-xl font-semibold mb-2">User Overview</h2>
            <p className="text-gray-600 mb-4">
              Monitor engineers and auditors' activity logs.
            </p>
            <button className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300">
              View Reports
            </button>
          </div>
        </div>
      )}

      {role === "ENGINEER" && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-6 rounded-2xl shadow-lg bg-white">
            <h2 className="text-xl font-semibold mb-2">Your Devices</h2>
            <p className="text-gray-600 mb-4">
              Add and manage devices assigned to you.
            </p>
            <button
              onClick={handleViewDevices}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Manage Devices
            </button>
          </div>

          <div className="p-6 rounded-2xl shadow-lg bg-white">
            <h2 className="text-xl font-semibold mb-2">Performance Logs</h2>
            <p className="text-gray-600 mb-4">
              Track system health and recent updates.
            </p>
            <button className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300">
              View Logs
            </button>
          </div>
        </div>
      )}

      {role === "AUDITOR" && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-6 rounded-2xl shadow-lg bg-white">
            <h2 className="text-xl font-semibold mb-2">Device Overview</h2>
            <p className="text-gray-600 mb-4">
              Review device configurations and compliance reports.
            </p>
            <button
              onClick={handleViewDevices}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              View Devices
            </button>
          </div>

          <div className="p-6 rounded-2xl shadow-lg bg-white">
            <h2 className="text-xl font-semibold mb-2">Audit Reports</h2>
            <p className="text-gray-600 mb-4">
              Access generated reports and system audits.
            </p>
            <button className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300">
              View Reports
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
