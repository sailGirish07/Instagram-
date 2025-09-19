import React from "react";
import { useNavigate } from "react-router-dom";


export default function HomeLink() {
    const navigate = useNavigate();

  return (
    <li onClick={() => navigate("/home")} className="home-link">
      <i className="fas fa-home"></i> Home
    </li>
  );
}
