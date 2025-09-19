import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileLink() {
  const navigate = useNavigate();

  return (
    <div className="profile-link" onClick={() => navigate("/profile")}>
      <i className="fas fa-user-circle profile"></i> Profile
    </div>
  );
}
