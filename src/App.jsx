// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./pages/Dashboard"; // Unified dashboard
import DeviceManagement from "./components/devices/DeviceManagement";

// 🔐 Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // 🧩 1️⃣ Redirect to login if not authenticated
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 🧩 2️⃣ Redirect to home if role not allowed
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const role = localStorage.getItem("role");

  return (
    <Router>
      {/* ✅ 3️⃣ Navbar outside <main> ensures it doesn't affect Home layout */}
      <Navbar />

      {/* Wrap Routes in <main> only if necessary */}
      <Routes>
        {/* 🏠 Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 📊 Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "ENGINEER", "AUDITOR"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* 🧩 Device Management */}
        <Route
          path="/devices"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "ENGINEER", "AUDITOR"]}>
              <DeviceManagement />
            </ProtectedRoute>
          }
        />

        {/* 🔁 Redirect /user → dashboard */}
        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "ENGINEER", "AUDITOR"]}>
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          }
        />

        {/* 🌐 Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
