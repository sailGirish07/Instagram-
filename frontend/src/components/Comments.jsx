import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import "../public/styles/comments.CSS";

export default function Comments() {
  const { postId } = useParams();
  const location = useLocation();
  const post = location.state?.post;

  const [comments, setComments] = useState([]); // start with empty list
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:8080/posts/${postId}/comments`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch((err) => console.error(err));
  }, [postId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:8080/posts/${postId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: newComment }),
      });
      const data = await res.json();
      setComments((prev) => [...prev, data]);
      setNewComment("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="comments-container">
      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet</p>
        ) : (
          comments.map((c, idx) => (
            <div key={idx} className="comment-item">
              <img
                src={
                  c.user?.profilePic
                    ? c.user.profilePic.startsWith("http")
                      ? c.user.profilePic
                      : `http://localhost:8080${c.user.profilePic}`
                    : "/default-avatar.png"
                }
                alt="profile"
                className="comment-avatar"
              />
              <div className="comment-body">
                <div className="comment-header">
                  <b className="comment-username">
                    {c.user?.userName || "Unknown"}:
                  </b>
                  <span className="comment-time">· 2w</span>
                </div>
                <p className="comment-text">{c.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="comment-input">
        <input
          type="text"
          placeholder="Add a comment.."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={handleAddComment}>Post</button>
      </div>
    </div>
  );
}
