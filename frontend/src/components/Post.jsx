import React, { useState } from "react";
import axios from "axios";
import "../public/styles/post.css";
import { useNavigate } from "react-router-dom"; 


export default function Post() {

    const navigate = useNavigate();
  const [formData, setFormData] = useState({ caption: "", media: null });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, media: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // get JWT

    const data = new FormData();
    data.append("media", formData.media);
    data.append("caption", formData.caption);

    try {
      const res = await axios.post("http://localhost:8080/posts", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });
      alert("✅ Post created!");
      setTimeout(() => {
        navigate('/profile')
      },1000);
      setFormData({ caption: "", media: null });
    //   setPreview(null);
    } catch (err) {
      console.error(err);
      alert("Error creating post");
    }
  };

  return (
    <div className="create-post-container">
      <h2>Create a Post</h2>
      <form onSubmit={handleSubmit} className="create-post-form">
        <div className="form-group">
          <label>Choose Media:</label>
          <input type="file" accept="image/*,video/*" onChange={handleFileChange} required />
        </div>
        <div className="form-group">
          <label>Caption:</label>
          <input
            type="text"
            name="caption"
            value={formData.caption}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="post-btn">Post</button>
      </form>
    </div>
  );
}
