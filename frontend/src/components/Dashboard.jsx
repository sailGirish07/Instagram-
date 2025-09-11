import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../public/styles/dashboared.CSS";
import SearchBar from "./SearchBar";

export default function Dashboard() {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("http://localhost:8080/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const unread = res.data.filter((n) => !n.read).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, [token]);

  return (
    // <div className="sidebar">
    //   <div className="logo">Instagram</div>
    //   <nav className="nav-menu">
    //     <ul>
    //       <li onClick={() => navigate("/home")}>
    //         <i className="fas fa-home"></i> Home
    //       </li>
    //       <li onClick={() => setShowSearch(!showSearch)}>
    //         <i className="fa-solid fa-magnifying-glass"></i> Search
    //       </li>
    //       {showSearch && <SearchBar />}
    //       <li onClick={() => navigate("/messages")}>
    //         <i className="far fa-paper-plane"></i>
    //         <span>Messages</span>
    //       </li>
    //       <li
    //         onClick={() => navigate("/notification")}
    //         className="notification-link"
    //       >
    //         <i className="far fa-heart"></i>
    //         <span>Notifications</span>
    //         {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
    //       </li>
    //     </ul>
    //   </nav>
    //   <div className="profile-link" onClick={() => navigate("/profile")}>
    //     <i className="fas fa-user-circle profile"></i> Profile
    //   </div>
    // </div>
     <div className="sidebar">
      <div className="logo">Instagram</div>
      <nav className="nav-menu">
        <ul>
          <li onClick={() => navigate("/home")}>
            <i className="fas fa-home"></i> 
            <span>Home</span>
          </li>
          <li onClick={() => setShowSearch(!showSearch)}>
            <i className="fa-solid fa-magnifying-glass"></i> 
            <span>Search</span>
          </li>
          {showSearch && <SearchBar />}
          <li onClick={() => navigate("/messages")}>
            <i className="far fa-paper-plane"></i>
            <span>Messages</span>
          </li>
          <li
            onClick={() => navigate("/notification")}
            className="notification-link"
          >
            <i className="far fa-heart"></i>
            <span>Notifications</span>
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </li>
        </ul>
      </nav>
      <div className="profile-link" onClick={() => navigate("/profile")}>
        <i className="fas fa-user-circle profile"></i> 
        <span>Profile</span>
      </div>
    </div>
  );
}
