// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./pages/Dashboard";
import DeviceManagement from "./components/devices/DeviceManagement";
import LicenseManagement from "./components/licenses/LicenseManagement";

// ✅ Toastify Imports
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AssignmentManagement from "./components/assignments/AssignmentManagement";
import AuthProvider from "./context/AuthContext";

// 🔐 Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider> 
    <Router>
      <Navbar />

      {/* ✅ Toast Container for Popup Alerts */}
      <ToastContainer
        theme="dark"
        position="top-center"
        autoClose={2000}
        closeOnClick
        pauseOnHover={false}
        draggable
        newestOnTop
        toastStyle={{
          backgroundColor: "rgba(20,20,30,0.85)",
          backdropFilter: "blur(6px)",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "ENGINEER", "AUDITOR"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/devices"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "ENGINEER", "AUDITOR"]}>
              <DeviceManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/licenses"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "ENGINEER", "AUDITOR"]}>
              <LicenseManagement />
            </ProtectedRoute>
          }
        />
       
        <Route path="/assignments" element={
           <ProtectedRoute allowedRoles={["ADMIN", "ENGINEER", "AUDITOR"]}>
              <AssignmentManagement />
            </ProtectedRoute>} />

        {/* Redirect /user → dashboard */}
        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "ENGINEER", "AUDITOR"]}>
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>

     </AuthProvider>
  );
}

export default App;
