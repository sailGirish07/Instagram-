import React from "react";
import saveIcon from "../assets/bookmark.png";
import imgSave from "../assets/imgSaved.png";
import "../public/styles/saveBtn.css";

export default function SaveButton({ saved, onToggle }) {
  return (
    <img
      src={saved ? imgSave : saveIcon}
      alt="save"
      className="save-icon"
      onClick={onToggle}
    />
  );
}
