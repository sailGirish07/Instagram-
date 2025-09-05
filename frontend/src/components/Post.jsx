import React, { useState, useEffect } from "react";
import axios from "axios";
import "../public/styles/post.css";

export default function PostCard({ post, token }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes.length);

  useEffect(() => {
    // Check if current user already liked this post
    const userId = localStorage.getItem("userId");
    setLiked(post.likes.includes(userId));
  }, [post.likes]);

  const handleLike = async () => {
    try {
      const res = await axios.put(
        `http://localhost:8080/posts/${post._id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLikesCount(res.data.likes);
      setLiked(!liked); // toggle heart
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  return (
    <div className="post-card">
      <img src={`http://localhost:8080${post.media}`} alt="post" />
      <div className="post-actions">
        <i className={`fa-solid fa-heart ${liked ? "liked" : ""}`}
         onClick={handleLike}
         ></i>
        <span>{likesCount}</span>
      </div>
      <p>{post.caption}</p>
    </div>
  );
}

