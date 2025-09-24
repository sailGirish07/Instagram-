import React from "react";
import chatIcon from "../assets/chat.png";
import "../public/styles/commentBtn.css";

export default function CommentButton({ onClick }) {
  return (
    <img
      src={chatIcon}
      alt="comment"
      className="comment-icon"
      onClick={onClick}
    />
  );
}
