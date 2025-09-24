import React from "react";
import sendIcon from "../assets/send.png";
import "../public/styles/ShareBtn.css";

export default function ShareButton({ onClick }) {
  return (
    <img
      src={sendIcon}
      alt="share"
      className="share-icon"
      onClick={onClick}
    />
  );
}
