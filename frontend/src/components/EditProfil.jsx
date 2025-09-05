import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../public/styles/editProfile.css";

export default function EditProfile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    bio: "",
    profilePic: null, // changed to file type
  });

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:8080/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData({
          fullName: res.data.fullName || "",
          userName: res.data.userName || "",
          bio: res.data.bio || "",
          profilePic: null,
        });
        setPreview(res.data.profilePic || "https://via.placeholder.com/150");
      } catch (err) {
        console.error(err);
        alert("Failed to fetch profile");
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profilePic: file });

    // Preview image
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("userName", formData.userName);
    data.append("bio", formData.bio);
    if (formData.profilePic) {
      data.append("profilePic", formData.profilePic);
    }

    try {
      await axios.put("http://localhost:8080/profile", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="edit-profile-container">
      <div className="profile-pic-section">
        <img src={preview || "https://via.placeholder.com/150"} alt="Profile" />
      </div>

      <form className="edit-profile-form" onSubmit={handleSubmit}>
        <label>Full Name :</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Full Name"
        />

        <label>User Name :</label>
        <input
          type="text"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          placeholder="User Name"
        />
        <label>Bio:</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Bio"
          rows={6} // show a bit taller for editing
          style={{
            resize: "vertical",
            whiteSpace: "pre-line", // preserves line breaks as user types
          }}
        />
        <label>Profile Picture:</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
