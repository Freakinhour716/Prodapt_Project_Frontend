// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { isLoggedIn, getCurrentUser } from "../services/auth";

const ProtectedRoute = ({ children, role }) => {
  if (!isLoggedIn()) return <Navigate to="/login" />;
  
  const user = getCurrentUser();
  if (role && user.role !== role) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;
