import React from "react";
import { useNavigate } from "react-router-dom";

export default function MessagesLink() {
  const navigate = useNavigate();

  return (
    <li onClick={() => navigate("/messages")} className="messages-link">
      <i className="far fa-paper-plane"></i> <span>Messages</span>
    </li>
  );
}
