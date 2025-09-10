import React, { useEffect, useState } from "react";
import "../public/styles/save.css";
import { useNavigate } from "react-router-dom";

export default function Save() {
  const [savedPosts, setSavedPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchSavedPosts = async () => {
      try {
        const res = await fetch("http://localhost:8080/posts/saved", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        const postsWithProfile = data.map((post) => ({
          ...post,
          user: {
            ...post.user,
            profilePic: post.user?.profilePic
              ? post.user.profilePic.startsWith("http")
                ? post.user.profilePic
                : `http://localhost:8080${post.user.profilePic}`
              : "/default-avatar.png",
          },
          media: post.media.startsWith("http")
            ? post.media
            : `http://localhost:8080${post.media}`,
        }));

        setSavedPosts(postsWithProfile);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSavedPosts();
  }, []);

  if (savedPosts.length === 0) {
    return <div className="no-saved">You haven't saved any posts yet.</div>;
  }

  return (
    <div className="save-page">
      <h2>Saved</h2>
      <div className="save-grid">
        {savedPosts.map((post) => (
          <div
            key={post._id}
            className="save-item"
            onClick={() => navigate(`/post/${post._id}`, { state: { post } })}
          >
            <img src={post.media} alt="saved post" />
          </div>
        ))}
      </div>
    </div>
  );
}
