import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <div className="logo">Instagram</div>
      <nav className="nav-menu">
        <ul>
          <li>
            <i className="icon-home"></i>
            <span>Home</span>
          </li>
          <li>
            <i className="icon-explore"></i>
            <span>Explore</span>
          </li>
          <li>
            <i className="icon-messages"></i>
            <span>Messages</span>
          </li>
          <li>
            <i className="icon-notifications"></i>
            <span>Notifications</span>
          </li>
        </ul>
      </nav>
      <div className="profile-link" onClick={() => navigate("/profile")}>
        <span>Profile</span>
      </div>
    </div>
  );
}
