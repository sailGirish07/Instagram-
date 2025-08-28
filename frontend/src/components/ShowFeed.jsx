import React, {useState, useEffect} from "react";
import '../public/styles/showFeed.css'
import chatIcon from "../assets/chat.png";
import saveIcon from '../assets/bookmark.png';
import heartIcon from '../assets/heart.png';
import sendIcon from '../assets/send.png';

export default function ShowFeed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:8080/posts", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error(err));
  }, []);

  return(
    <div className="feed">
      {posts.map((post) => (
        <div key={post._id} className="post">
          {/* User Info */}
          <div className="post-header">
            <img
              src={
                post.user?.profilePic
                  ? `http://localhost:8080${post.user.profilePic}`
                  : "/default-avatar.png"
              }
              alt="profile"
              className="profile-pic"
            />
            <span className="username">{post.user?.userName}</span>
          </div>

          {/* Media */}
          <div className="post-media">
            <img
              src={`http://localhost:8080${post.media}`}
              alt="post-media"
            />
          </div>

          <div className="post-actions">
  <div className="left-actions">
    <div className="heart-wrapper">
      <img
        src={heartIcon}
        alt="like"
        className="action-icon heart-icon"
      />
      <div className="post-likes">
        <b>{post.likes.length} likes</b>
      </div>
    </div>

    <img src={chatIcon} alt="comment" className="action-icon" />
    <img src={sendIcon} alt="share" className="action-icon" />
  </div>
  <div className="right-actions">
    <img src={saveIcon} alt="save" className="action-icon" />
  </div>
</div>
        </div>
      ))}
    </div>
  );
};
