import React from "react";
import { useNavigate } from "react-router-dom";
import Logout from "./Logout";
import saveIcon from "../assets/bookmark.png";
import "../public/styles/menu.css";

export default function Menu() {
  const navigate = useNavigate();

  const goToSaved = () => {
    navigate("/saved");
  };

  return (
    <div className="menu-container">
      <div className="menu-item" onClick={goToSaved}>
        <img src={saveIcon} alt="Saved" className="menu-icon" />
        <span className="menu-text">Saved</span>
      </div>
      <Logout />
    </div>
  );
}
