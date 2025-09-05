import React, { useState, useEffect } from "react";
import axios from "axios";
import "../public/styles/notification.css";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("token");
  useEffect(() => {
  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:8080/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(
        "http://localhost:8080/notifications/mark-all-read",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  // Fetch and mark as read when Notifications page loads
  fetchNotifications();
  markAllAsRead();

  const interval = setInterval(fetchNotifications, 5000);
  return () => clearInterval(interval);
}, [token]);

//Update: unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <ul className="notifications-list">
          {notifications.map((note, index) => (
            <li key={index} className="notification-item">
              {note.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
