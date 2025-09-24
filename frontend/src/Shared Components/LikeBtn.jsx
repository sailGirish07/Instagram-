import React from "react";
import likeIcon from "../assets/like.png";
import heartIcon from "../assets/heart.png";
import "../public/styles/likeBtn.css";

export default function LikeButton({ liked, likes, animate, onToggle }) {
  return (
    <div className="like-wrapper">
      <img
        src={liked ? likeIcon : heartIcon}
        alt="like"
        className={`like-icon ${animate ? "animate-like" : ""}`}
        onClick={onToggle}
      />
      <div className="like-count">
        <b>{likes} likes</b>
      </div>
    </div>
  );
}
