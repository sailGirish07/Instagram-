import React from "react";
import { useNavigate } from "react-router-dom";
import '../public/styles/dashboared.CSS'

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove JWT
    navigate("/login"); // Navigate to login page
  };

  return (
    <div className="sidebar">
      <div className="logo">Instagram</div>
      <nav className="nav-menu">
        <ul>
          <li>
             <i className="fas fa-home"></i>
            <span>Home</span>
          </li>
          <li>
            <i className="far fa-compass"></i>
            <span>Explore</span>
          </li>
          <li>
             <i className="far fa-paper-plane"></i>
            <span>Messages</span>
          </li>
          <li>
             <i className="far fa-heart"></i>
            <span>Notifications</span>
          </li>
        </ul>
      </nav>
      <div className="profile-link" onClick={() => navigate("/profile")}>
         <i className="fas fa-user-circle profile"></i>
        <span>Profile</span>
      </div>

      {/* Logout Button */}
      <div className="logout-link" onClick={handleLogout}>
        <i className="fas fa-sign-out-alt"></i>
        <span>Logout</span>
      </div>
    </div>
  );
}
