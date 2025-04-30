import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiService from "./apiService";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log("🚀 Sending login request with:", { email, password });
      const res = await apiService.login({ email, password });
      console.log("✅ Login API response:", res.data);
  
      navigate("/");
    } catch (err) {
      console.error("❌ Login failed - full error object:", err);
      alert(err?.response?.data || err.message || "Login failed");
    }
  };
 
  return (
    <div className="container form-container">
      <h2>Customer Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="primary-button">Login</button>
        </div>
      </form>

      <div className="form-group" style={{ marginTop: "1rem", textAlign: "center" }}>
        <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
      </div>
    </div>
  );
}

export default Login;