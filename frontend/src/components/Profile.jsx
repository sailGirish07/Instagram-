import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../public/styles/profile.css";
import createPostIcon from "../assets/create-post.png";
import menu from "../assets/menu.png";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Fetch user profile
        const resUser = await axios.get("http://localhost:8080/api/v1/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(resUser.data);

        // Fetch user posts
        const resPosts = await axios.get(
          "http://localhost:8080/api/v1/users/profile-posts",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPosts(resPosts.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        alert("Failed to fetch profile. Please login again.");
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate, token]);

  if (!user) return <p>Loading...</p>;

  const goToCreatePost = () => navigate("/post");
  const goToMenu = () => navigate("/menu");

   // Navigate to List.jsx with list type and userId
  const handleListNavigation = (type) => {
    navigate(`/list/${type}/${user._id}`);
  };

  return (
    <div className="profile-container">
      <div className="profile-icons">
      
        <img
          src={createPostIcon}
          // src="/assets/create-post.png"
          className="post-icon"
          alt="Create Post"
          onClick={goToCreatePost}
        />
        <img src={menu} className="post-icon" alt="menu" onClick={goToMenu} />
      </div>
      <div className="profile-header">
        <div className="profile-left">
          <h2>{user.userName}</h2>
          <img
            src={user.profilePic || "https://via.placeholder.com/150"}
            alt="Profile"
            className="profile-img"
          />
          <div className="profile-bio">
            <p>
              <strong>{user.fullName}</strong>
            </p>
            <p>{user.bio || "Bio"}</p>
          </div>
        </div>

        <div className="profile-right">
          <div className="profile-stats">
            {/* <p>
              <strong>{posts.length}</strong> posts
            </p>
            <p>
              <strong>{user.followers?.length || 0}</strong> followers
            </p>
            <p>
              <strong>{user.following?.length || 0}</strong> following
            </p> */}
             {/* Clickable followers */}
            <p
              style={{ cursor: "pointer" }}
              onClick={() => handleListNavigation("followers")}
            >
              <strong>{user.followers?.length || 0}</strong> followers
            </p>

            {/* Clickable following */}
            <p
              style={{ cursor: "pointer" }}
              onClick={() => handleListNavigation("following")}
            >
              <strong>{user.following?.length || 0}</strong> following
            </p>
          </div>
        </div>
      </div>

      <button onClick={() => navigate("/edit-profile")}>Edit Profile</button>

      {/* Posts grid */}
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

