import React, { useState } from "react";

export default function Comments() {
  const [comments, setComments] = useState([]); // start with empty list
  const [newComment, setNewComment] = useState("");
  
  return (
    <div>
      <h2>Comments</h2>
      {comments.length === 0 && <p>No comments yet</p>}

      {comments.map((comment) => (
        <div key={comment.id}>
          <p>
            <b>{comment.user}:</b> {comment.text}
          </p>
        </div>
      ))}

      {/* Input box */}
      <div>
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button>Post</button>
      </div>
    </div>
  );
}
