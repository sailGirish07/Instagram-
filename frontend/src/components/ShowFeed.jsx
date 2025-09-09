import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../public/styles/showFeed.css";
import chatIcon from "../assets/chat.png";
import saveIcon from "../assets/bookmark.png";
import sendIcon from "../assets/send.png";
import heartIcon from "../assets/heart.png";
import like from "../assets/like.png";

export default function ShowFeed() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  // const [openComments, setOpenComments] = useState(null);
  // const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = token ? JSON.parse(atob(token.split(".")[1])).userId : null;

    fetch("http://localhost:8080/posts", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const postsWithLiked = data.map((post) => {
          let profilePic = "/default-avatar.png";
          if (post.user?.profilePic) {
            profilePic = post.user.profilePic.startsWith("http")
              ? post.user.profilePic
              : `http://localhost:8080${post.user.profilePic}`;
          }

          let media = post.media;
          if (media && !media.startsWith("http")) {
            media = `http://localhost:8080${media}`;
          }

          return {
            ...post,
            liked: userId ? post.likes.includes(userId) : false,
            likes: post.likes.length,
            user: { ...post.user, profilePic },
            media,
            animate: false, // animation flag
          };
        });

        setPosts(postsWithLiked);
      })
      .catch((err) => console.error(err));
  }, []);

  const toggleLike = async (postId) => {
    const token = localStorage.getItem("token");

    // Instant UI update
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post._id === postId) {
          const liked = !post.liked;
          return {
            ...post,
            liked,
            likes: liked ? post.likes + 1 : post.likes - 1,
            animate: liked, // only animate on like
          };
        }
        return post;
      })
    );

    try {
      const res = await fetch(`http://localhost:8080/posts/${postId}/like`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      // Sync likes count from server
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, likes: data.likes } : post
        )
      );

      // Remove animation after 300ms
      setTimeout(() => {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId ? { ...post, animate: false } : post
          )
        );
      }, 300);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="feed">
      {posts.map((post) => (
        <div key={post._id} className="post">
          {/* User Info */}
          <div className="post-header">
            <img
              src={post.user?.profilePic || "/default-avatar.png"}
              alt="profile"
              className="profile-pic"
            />
            <span className="username">{post.user?.userName}</span>
          </div>

          {/* Media */}
          <div className="post-media">
            <img src={post.media} alt="post-media" />
          </div>

          {/* Actions */}
          <div className="post-actions">
            <div className="left-actions">
              <div className="heart-wrapper">
                <img
                  src={post.liked ? like : heartIcon}
                  alt="like"
                  className={`action-icon heart-img ${
                    post.animate ? "animate-like" : ""
                  }`}
                  onClick={() => toggleLike(post._id)}
                />
                <div className="post-likes">
                  <b>{post.likes} likes</b>
                </div>
              </div>

              <img
                src={chatIcon}
                alt="comment"
                className="action-icon"
                onClick={() =>
                 navigate(`/comments/${post._id}`, {state : {post}})
                }
              />

              <img
                src={sendIcon}
                alt="share"
                className="action-icon"
                onClick={() =>
                  navigate("/messages", { state: { sharePost: post._id } })
                }
              />
            </div>
            <div className="right-actions">
              <img src={saveIcon} alt="save" className="action-icon" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
