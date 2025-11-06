// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { isLoggedIn, getCurrentUser } from "../services/auth";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  if (!isLoggedIn()) return <Navigate to="/login" replace />;

  const user = getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;

  // Normalize role (remove prefix if exists)
  const normalizedRole = user.role?.replace("ROLE_", "");

  // Check allowed roles (if provided)
  if (allowedRoles.length > 0 && !allowedRoles.includes(normalizedRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
