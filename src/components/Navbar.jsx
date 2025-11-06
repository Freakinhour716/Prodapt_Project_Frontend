// src/components/Navbar.jsx
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const isLoggedIn = Boolean(user?.token);
  const username = user?.username || "";
  const role = user?.role?.toUpperCase?.() || "";

  const handleLogout = () => {
    logout();
    toast.success("✅ Logged out successfully!");
    navigate("/");
  };

  return (
    <nav className="nav-glass">
      <div className="nav-left">
        <Link className="brand-logo" to="/">
          License<span>Tracker</span>
        </Link>

        {/* ✅ Greeting when logged in */}
        {isLoggedIn && (
          <span className="greeting">
            👋 Hi, <strong>{username}</strong> ({role})
          </span>
        )}
      </div>

      <div className="nav-right">
        {!isLoggedIn ? (
          <>
            <Link className="nav-btn" to="/login">Login</Link>
            <Link className="nav-btn" to="/signup">Signup</Link>
          </>
        ) : (
          <>
            <Link className="nav-btn" to="/dashboard">Dashboard</Link>

            {["ADMIN", "ENGINEER", "AUDITOR"].includes(role) && (
              <>
                <Link className="nav-btn" to="/devices">Devices</Link>
                <Link className="nav-btn" to="/licenses">Licenses</Link>
                <Link className="nav-btn" to="/assignments">Assignments</Link>
              </>
            )}

            {/* ✅ ADMIN ONLY Button */}
            {isAdmin && (
              <Link className="nav-btn admin-btn" to="/user-management">
                User Management
              </Link>
            )}

            <button className="nav-btn danger" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
