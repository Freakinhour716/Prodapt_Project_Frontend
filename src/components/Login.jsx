// src/components/Login.jsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // Axios instance
import "./Login.css";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", form);
      const { token, role } = response.data;

      // ✅ Update AuthContext state
      login(token, role);

      // ✅ Navigate AFTER state update
      setTimeout(() => {
        if (role === "ADMIN" || role === "ENGINEER") {
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/user", { replace: true });
        }
      }, 0);

    } catch (err) {
      console.error("Login error:", err.response || err);
      alert(err.response?.data || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
