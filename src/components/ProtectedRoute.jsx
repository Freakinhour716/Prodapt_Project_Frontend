// ✅ src/components/ProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null; // ⏳ Wait for auth to resolve

  if (!user?.token) return <Navigate to="/login" replace />;

  const role = user.role?.replace("ROLE_", "").toUpperCase();

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
