import React, { useState, useEffect } from "react";
import axios from "axios";

export default function NotificationsLink() {
  const [unreadCount, setUnreadCount] = useState(0);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/v1/notifications",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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

  const handleClick = () => {
    window.location.href = "/notification";
  };

  return (
    <li onClick={handleClick} className="notification-link">
      <i className="far fa-heart"></i>
      <span>Notifications</span>
      {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
    </li>
  );
}
