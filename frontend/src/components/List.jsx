import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../public/styles/List.css";

export default function List() {
  const { type, userId } = useParams(); // type = "followers" or "following"
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const loggedInUserId = JSON.parse(localStorage.getItem("user"))?._id;

  // Fetch followers/following
  useEffect(() => {
    const fetchList = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:8080/api/v1/users/${userId}/${type}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching list:", err);
        alert("Failed to fetch list");
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, [type, userId, token]);

  // Follow a user
  const handleFollow = async (idToFollow) => {
    try {
      await axios.put(
        `http://localhost:8080/api/v1/users/${idToFollow}/follow`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((prev) =>
        prev.map((u) =>
          u.userId === idToFollow ? { ...u, isFollowedByMe: true } : u
        )
      );
    } catch (err) {
      console.error("Follow error:", err);
      alert("Failed to follow user");
    }
  };

  // Unfollow a user
  const handleUnfollow = async (idToUnfollow) => {
    try {
      await axios.put(
        `http://localhost:8080/api/v1/users/${idToUnfollow}/unfollow`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((prev) =>
        prev.map((u) =>
          u.userId === idToUnfollow ? { ...u, isFollowedByMe: false } : u
        )
      );
    } catch (err) {
      console.error("Unfollow error:", err);
      alert("Failed to unfollow user");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="list-container">
      <h2>{type.charAt(0).toUpperCase() + type.slice(1)} List</h2>
      {users.length === 0 ? (
        <p>No {type} yet</p>
      ) : (
        <ul className="user-list">
          {users.map((u) => {
            const isSelfProfile = userId === loggedInUserId;
            return (
              <li key={u.userId} className="user-item">
                <img
                  src={u.profilePic || "https://via.placeholder.com/50"}
                  alt={u.userName}
                  className="user-img"
                />
                <div className="user-info">
                  <span className="user-name">{u.userName}</span>
                  <span className="user-fullName">{u.fullName}</span>
                </div>

                <div className="user-actions">
                  {/* Message button is always visible */}
                  <button
                    className="btn message-btn"
                    onClick={() => navigate(`/chat/${u.userId}`)}
                  >
                    Message
                  </button>

                  {/* SELF PROFILE CASE */}
                  {isSelfProfile &&
                    type === "followers" &&
                    (u.isFollowedByMe ? (
                      <button
                        className="btn unfollow-btn"
                        onClick={() => handleUnfollow(u.userId)}
                      >
                        Following
                      </button>
                    ) : (
                      <button
                        className="btn follow-btn"
                        onClick={() => handleFollow(u.userId)}
                      >
                        Follow
                      </button>
                    ))}

                  {isSelfProfile && type === "following" && (
                    <button
                      className="btn unfollow-btn"
                      onClick={() => handleUnfollow(u.userId)}
                    >
                      Unfollow
                    </button>
                  )}

                  {/* OTHER USER PROFILE CASE */}
                  {!isSelfProfile &&
                    (u.isFollowedByMe ? (
                      <button
                        className="btn unfollow-btn"
                        onClick={() => handleUnfollow(u.userId)}
                      >
                        Following
                      </button>
                    ) : (
                      <button
                        className="btn follow-btn"
                        onClick={() => handleFollow(u.userId)}
                      >
                        Follow
                      </button>
                    ))}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
