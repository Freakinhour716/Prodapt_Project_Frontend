// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    loadUser();
    const handleStorageChange = () => loadUser();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setUser(null);
    navigate("/login");
  };

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

  // ✅ Devices & Licenses visible for Admin + Engineer
  const showManagementLinks =
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

            {showManagementLinks && (
              <>
                <Link className="btn btn-outline-info me-2" to="/devices">
                  Devices
                </Link>

                {/* ✅ New Licenses Link */}
                <Link className="btn btn-outline-warning me-2" to="/licenses">
                  Licenses
                </Link>
              </>
            )}

            <button className="btn btn-outline-danger" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
