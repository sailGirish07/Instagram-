import React from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="logout-link" onClick={handleLogout}>
      <span style={{ color: "red", fontSize: "20px" }}>Log out</span>
    </div>
  );
}
