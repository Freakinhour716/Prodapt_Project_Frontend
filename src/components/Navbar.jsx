// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // 🔹 Load user info from localStorage
  const loadUser = () => {
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    if (token && username && role) {
      setUser({ name: username, role });
    } else {
      setUser(null);
    }
  };

  // 🔹 Run once on mount
  useEffect(() => {
    loadUser();

    // 🔹 Listen for localStorage updates (login/logout)
    const handleStorageChange = () => loadUser();
    window.addEventListener("storage", handleStorageChange);

    // 🔹 Cleanup listener
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // 🔹 Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setUser(null);
    navigate("/login");
  };

  // 🔹 Get correct dashboard route
  const getDashboardLink = () => {
    if (!user) return "/";
    switch (user.role.trim().toUpperCase()) {
      case "ADMIN":
        return "/dashboard/admin";
      case "AUDITOR":
        return "/dashboard/auditor";
      case "ENGINEER":
        return "/dashboard/engineer";
      default:
        return "/";
    }
  };

  // 🔹 Devices link visible for Admin / Engineer
  const showDevicesLink =
    user &&
    ["ADMIN", "ENGINEER"].includes(user.role.trim().toUpperCase());

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to={getDashboardLink()}>
        License Tracker
      </Link>

      <div className="ms-auto d-flex align-items-center">
        {!user ? (
          <>
            <Link className="btn btn-outline-light me-2" to="/login">
              Login
            </Link>
            <Link className="btn btn-outline-light" to="/signup">
              Signup
            </Link>
          </>
        ) : (
          <>
            <span className="text-light me-3">
              👋 Hello, <strong>{user.name}</strong>
            </span>

            <Link className="btn btn-outline-light me-2" to={getDashboardLink()}>
              Dashboard
            </Link>

            {showDevicesLink && (
              <Link className="btn btn-outline-info me-2" to="/devices">
                Devices
              </Link>
            )}

            <button
              className="btn btn-outline-danger"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
