


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../public/styles/profile.css"; // reuse the same CSS as Profile.js

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
        setPosts(res.data.posts);
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };
    fetchUser();
  }, [id, token]);

  if (!user) return <p>Loading...</p>;


  const handleMessageClick = () => {
    navigate(`/chat/${id}`);
  };
  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-left">
          <h2>{user.userName}</h2>
          <img
            src={user.profilePic || "https://via.placeholder.com/150"}
            alt="Profile"
            className="profile-img"
          />
          <div className="profile-bio">
            <p><strong>{user.fullName}</strong></p>
            <p>{user.bio || "Bio"}</p>

              <button
            onClick={handleMessageClick}
            style={{
              marginTop: "10px",
              padding: "8px 16px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#0095f6",
              color: "white",
              cursor: "pointer",
            }}
          >
            Message
          </button>
          </div>
        </div>

        <div className="profile-right">
          <div className="profile-stats">
            <p><strong>{posts.length}</strong> posts</p>
            <p><strong>{user.followers?.length || 0}</strong> followers</p>
            <p><strong>{user.following?.length || 0}</strong> following</p>
          </div>
        </div>
      </div>

      <div className="posts-grid">
        {posts.length === 0 && <p>No posts yet</p>}
        {posts.map((post) => (
          <div key={post._id} className="post-card">
            <img src={`http://localhost:8080${post.media}`} alt="post" />
          </div>
        ))}
      </div>
    </div>
  );
}
