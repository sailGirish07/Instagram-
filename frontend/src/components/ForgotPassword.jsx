import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export function ForgotPassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
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

    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const res = await axios.post("http://localhost:8080/auth/forgot-pass", {
        email: formData.email,
        newPassword: formData.newPassword,
      });
      console.log("Password reset successfully", res.data);
      setFormData({
        email: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      console.error("Password reset successfully", err);
    }
  };

  return (
    <div>
      <h1>Reset Password</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {/* <br />
        <br /> */}
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={formData.newPassword}
          onChange={handleChange}
          required
        />
        {/* <br />
        <br /> */}
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        {/* <br />
        <br /> */}
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}
