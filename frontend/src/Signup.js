import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './App.css';

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    axios.post("/api/customers/signup", {
        email,
        password,
        first_name: first,
        last_name: last
      })
        .then((res) => {
          localStorage.setItem("customerId", res.data.customerId);
          localStorage.setItem("cartId", res.data.cartId);
          localStorage.setItem("customerName", `${first} ${last}`);
          navigate("/");
          window.location.reload();
        })
        .catch(err => {
          alert(err.response?.data || "Signup failed");
        });      
  };

  return (
    <div className="container form-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <div className="form-group">
          <label>First Name</label>
          <input
            value={first}
            onChange={(e) => setFirst(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Last Name</label>
          <input
            value={last}
            onChange={(e) => setLast(e.target.value)}
            required
          />
        </div>

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
          <button type="submit" className="primary-button">Create Account</button>
        </div>
      </form>
    </div>
  );
}

export default Signup;