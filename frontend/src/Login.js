import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import './App.css';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post("/api/customers/login", { email, password })
    .then((res) => {
        localStorage.setItem("customerId", res.data.customerId);
        localStorage.setItem("cartId", res.data.cartId);
        localStorage.setItem("customerName", res.data.customerName);
        navigate("/");
        window.location.reload();
    })
  .catch(() => alert("Invalid login"));

  };

  return (
    <div className="container form-container">
      <h2>Customer / Staff Login</h2>
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