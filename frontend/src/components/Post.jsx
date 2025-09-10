import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../public/styles/post.css";

export default function CreatePost() {
  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!media) return alert("Please upload an image/video");

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("media", media);

    try {
      await axios.post("http://localhost:8080/posts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/profile");
    } catch (err) {
      console.error("Error creating post:", err);
      alert("Failed to create post");
    }
  };

  return (
    <div className="create-post-container">
      <h2>Create a Post</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setMedia(e.target.files[0])}
          required
        />
        <textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <button type="submit">Post</button>
      </form>
    </div>
  );
}
