// src/components/Login.jsx
/*import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // Axios instance
import "./Login.css";


export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // ✅ Prevent page reload
    console.log("Login form submitted:", form);

    try {
      const response = await api.post("/auth/login", form);
      console.log("Login response:", response.data);

      // Save JWT token in localStorage
      localStorage.setItem("token", response.data.token);

      // Redirect to user details page
      navigate("/user");
    } catch (err) {
      console.error("Login error:", err.response || err);
      alert(err.response?.data || "Login failed");
    }
  };

  return (
  <div className="login-container">
    <h2>Login</h2>
    <form onSubmit={handleSubmit}>
      <div>
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
      <div>
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
);

}

*/


// src/components/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // Axios instance
import "./Login.css";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    try {
      const response = await api.post("/auth/login", form);
      const { token, username, role } = response.data;

      // Save JWT token, username, and role
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      localStorage.setItem("role", role);

      // Redirect based on role
      switch (role) {
        case "ADMIN":
          navigate("/admin");
          break;
        case "AUDITOR":
          navigate("/auditor");
          break;
        case "ENGINEER":
          navigate("/engineer");
          break;
        default:
          navigate("/user");
      }
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
