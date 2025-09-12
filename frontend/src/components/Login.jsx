import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../public/styles/login.css";

export function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/auth/login",
        formData
      );
      alert(res.data.message);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      } else {
        alert("Login failed: no token received");
        return;
      } // Save JWT token in localStorage

      setFormData({
        email: "",
        password: "",
      });
      console.log("Form Submitted!", formData);

      setTimeout(() => {
        navigate("/home");
      }, 1000);
    } catch (err) {
      console.error(err);
      alert("Error logging in");
    }
  };

  return (
    <>
      <div className="login-container">
        <h1>Instagram</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          {/* <br />
          <br /> */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          {/* <br />
          <br /> */}
          <button type="submit">Log in</button>
          <p>
            <a href="/forgot-password">Forgot Password?</a>
          </p>
        </form>
      </div>
      <div className="signup-container">
        <p>
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </>
  );
}
