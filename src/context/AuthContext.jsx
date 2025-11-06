import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  // ✅ Initialize user from localStorage
  const [user, setUser] = useState(() => ({
    token: localStorage.getItem("token"),
    role: localStorage.getItem("role"),
    username: localStorage.getItem("username"),
  }));

  // ✅ Login handler
  const login = (token, role, username) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("username", username);

    setUser({ token, role, username });
  };

  // ✅ Logout handler
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");

    setUser({ token: null, role: null, username: null });
  };

  // ✅ RBAC helpers
  const role = user.role?.toUpperCase();
  const isAdmin = role === "ADMIN";
  const isEngineer = role === "ENGINEER";
  const isAuditor = role === "AUDITOR";

  // ✅ Who can manage CRUD? (Admin + Engineer)
  const canManage = isAdmin || isEngineer;

  // ✅ Sync UI if storage changes externally (multi tabs)
  useEffect(() => {
    const syncAuth = () => {
      setUser({
        token: localStorage.getItem("token"),
        role: localStorage.getItem("role"),
        username: localStorage.getItem("username"),
      });
    };

    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAdmin,
        isEngineer,
        isAuditor,
        canManage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
