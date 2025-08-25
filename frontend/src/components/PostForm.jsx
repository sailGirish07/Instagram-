import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PostForm() {

    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Post submitted:", formData);
    alert("Post submitted successfully!");
    setFormData({ title: "", content: "" });
    setTimeout(() => {
        navigate('/home');
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create a Post</h2>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <textarea
        name="content"
        placeholder="Write your content here..."
        value={formData.content}
        onChange={handleChange}
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
}
