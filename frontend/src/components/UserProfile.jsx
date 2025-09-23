import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(() => {
    // Load from localStorage so it won't reset after refresh
    return JSON.parse(localStorage.getItem(`follow_state_${id}`)) || false;
  });

  const token = localStorage.getItem("token");
  const loggedInUserId = JSON.parse(localStorage.getItem("user"))?._id;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/v1/users/user/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUser(res.data.user);
        setPosts(res.data.posts);

        // Only set isFollowing once if localStorage doesn't have a value
        if (localStorage.getItem(`follow_state_${id}`) === null) {
          const initialState = res.data.user.followers.some(
            (f) => f._id === loggedInUserId
          );
          setIsFollowing(initialState);
          localStorage.setItem(
            `follow_state_${id}`,
            JSON.stringify(initialState)
          );
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    fetchUser();
  }, [id, token, loggedInUserId]);

  if (!user) return <p>Loading...</p>;

  const toggleFollow = async () => {
    if (!token) return navigate("/login");

    try {
      let updatedUser;

      if (!isFollowing) {
        // Follow
        await axios.put(
          `http://localhost:8080/api/v1/users/${id}/follow`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Update user followers locally
        updatedUser = {
          ...user,
          followers: [...(user.followers || []), { _id: loggedInUserId }],
        };
        setIsFollowing(true);
        localStorage.setItem(`follow_state_${id}`, JSON.stringify(true));
      } else {
        // Unfollow
        await axios.put(
          `http://localhost:8080/api/v1/users/${id}/unfollow`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Remove logged-in user from followers locally
        updatedUser = {
          ...user,
          followers: (user.followers || []).filter(
            (f) => f.userId !== loggedInUserId
          ),
        };
        setIsFollowing(false);
        localStorage.setItem(`follow_state_${id}`, JSON.stringify(false));
      }

      // Update user state immediately
      setUser(updatedUser);
    } catch (err) {
      console.error("Follow/Unfollow error:", err);
      alert(err.response?.data?.message || "Action failed");
    }
  };
  // Navigate to List.jsx with list type and userId
  const handleListNavigation = (type) => {
    navigate(`/list/${type}/${user._id}`);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-left">
          <h2>{user.userName}</h2>
          <img
            src={user.profilePic || "/default-profile.png"}
            alt="Profile"
            className="profile-img"
          />
          <div className="profile-bio">
            <p>
              <strong>{user.fullName}</strong>
            </p>
            <p>{user.bio || "Bio"}</p>

            <button
              onClick={toggleFollow}
              style={{
                marginTop: "10px",
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: isFollowing ? "#e5e5e5" : "#0095f6",
                color: isFollowing ? "black" : "white",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>

            <button
              onClick={() => navigate(`/chat/${id}`)}
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
            <p>
              <strong>{posts.length}</strong> posts
            </p>
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
