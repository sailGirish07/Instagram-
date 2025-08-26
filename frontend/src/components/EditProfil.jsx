import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
    const [formData, setFormData] = useState({
        fullName: "",
        userName: "",
        bio: "",
        profilePic: ""
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:8080/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFormData({
                    fullName: res.data.fullName,
                    userName: res.data.userName,
                    bio: res.data.bio,
                    profilePic: res.data.profilePic
                });
            } catch (err) {
                console.error(err);
                alert("Failed to fetch profile. Please login again.");
                navigate("/login");
            }
        };
        fetchProfile();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.put("http://localhost:8080/profile", formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate("/profile"); // Redirect to profile
        } catch (err) {
            console.error(err);
            alert("Failed to update profile");
        }
    };

    return (
        <div>
            <div>
                <img src={formData.profilePic || "https://via.placeholder.com/150"} alt="Profile" />
                <p><a href="#">Update profile picture URL</a></p>
            </div>
            <form onSubmit={handleSubmit}>
                <label>Full Name :</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" />
                <br /><br />
                <label>User Name :</label>
                <input type="text" name="userName" value={formData.userName} onChange={handleChange} placeholder="User Name" />
                <br /><br />
                <label>Bio:</label>
                <input type="text" name="bio" value={formData.bio} onChange={handleChange} placeholder="Bio" />
                <br /><br />
                <label>Profile Picture URL:</label>
                <input type="text" name="profilePic" value={formData.profilePic} onChange={handleChange} placeholder="Profile Pic URL" />
                <br /><br />
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
}
