// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "../public/styles/profile.css";
// import createPostIcon from "../assets/create-post.png";
// import menu from "../assets/menu.png";

// export default function Profile() {
//   const [user, setUser] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         // Fetch user profile
//         const resUser = await axios.get(
//           "http://localhost:8080/api/v1/users/profile",
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setUser(resUser.data);

//         // Fetch user posts
//         const resPosts = await axios.get(
//           "http://localhost:8080/api/v1/users/profile-posts",
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setPosts(resPosts.data);
//       } catch (err) {
//         console.error("Error fetching profile:", err);
//         alert("Failed to fetch profile. Please login again.");
//         navigate("/login");
//       }
//     };

//     fetchProfile();
//   }, [navigate, token]);

//   if (!user) return <p>Loading...</p>;

//   const goToCreatePost = () => navigate("/post");
//   const goToMenu = () => navigate("/menu");

//   // In your Profile.jsx, ensure the navigation works correctly
//   const handleListNavigation = (type) => {
//     navigate(`/list/${type}/${user._id}`);
//   };

//   return (
//     <div className="profile-container">
//       <div className="profile-icons">
//         <img
//           src={createPostIcon}
//           // src="/assets/create-post.png"
//           className="post-icon"
//           alt="Create Post"
//           onClick={goToCreatePost}
//         />
//         <img src={menu} className="post-icon" alt="menu" onClick={goToMenu} />
//       </div>
//       <div className="profile-header">
//         <div className="profile-left">
//           <h2>{user.userName}</h2>
//           <img
//             src={user.profilePic || "https://via.placeholder.com/150"}
//             alt="Profile"
//             className="profile-img"
//           />
//           <div className="profile-bio">
//             <p>
//               <strong>{user.fullName}</strong>
//             </p>
//             <p>{user.bio || "Bio"}</p>
//           </div>
//         </div>

//         <div className="profile-right">
//           <div className="profile-stats">
//             <p>
//               <strong>{posts.length}</strong> posts
//             </p>
//             <p
//               style={{ cursor: "pointer" }}
//               onClick={() => handleListNavigation("followers")}
//             >
//               <strong>{user.followers?.length || 0}</strong> followers
//             </p>
//             <p
//               style={{ cursor: "pointer" }}
//               onClick={() => handleListNavigation("following")}
//             >
//               <strong>{user.following?.length || 0}</strong> following
//             </p>
//           </div>
//         </div>
//       </div>
//       <button onClick={() => navigate("/edit-profile")}>Edit Profile</button>

//       {/* Posts grid */}
//       <div className="posts-grid">
//         {posts.length === 0 && <p>No posts yet</p>}
//         {posts.map((post) => (
//           <div key={post._id} className="post-card">
//             <img src={`http://localhost:8080${post.media}`} alt="post" />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState, useRef } from "react"; // ✅ Added useRef
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
  const videoRefs = useRef({}); // ✅ Store refs for multiple videos

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Fetch user profile
        const resUser = await axios.get(
          "http://localhost:8080/api/v1/users/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(resUser.data);

        // Fetch user posts
        const resPosts = await axios.get(
          "http://localhost:8080/api/v1/users/profile-posts",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // ✅ Normalize media for each post
        const normalizedPosts = resPosts.data.map((post) => {
          let mediaUrl = "";
          let mediaType = "image";

          if (typeof post.media === "string") {
            mediaUrl = post.media;
            if (post.media.endsWith(".mp4")) mediaType = "video";
          } else if (post.media && typeof post.media === "object") {
            mediaUrl = post.media.url;
            mediaType = post.media.type;
          }

          return { ...post, media: { url: mediaUrl, type: mediaType } };
        });

        setPosts(normalizedPosts);
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

  const handleListNavigation = (type) => {
    navigate(`/list/${type}/${user._id}`);
  };

  // ✅ Function to toggle video play/pause
  const handleVideoClick = (postId) => {
    const videoElement = videoRefs.current[postId];
    if (videoElement) {
      if (videoElement.paused) {
        videoElement.play();
      } else {
        videoElement.pause();
      }
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-icons">
        <img
          src={createPostIcon}
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
            <p>
              <strong>{posts.length}</strong> posts
            </p>
            <p
              style={{ cursor: "pointer" }}
              onClick={() => handleListNavigation("followers")}
            >
              <strong>{user.followers?.length || 0}</strong> followers
            </p>
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

      {/* ✅ Posts grid with video support */}
      <div className="posts-grid">
        {posts.length === 0 && <p>No posts yet</p>}
        {posts.map((post) => (
          <div key={post._id} className="post-card">
            {post.media.type === "video" ? (
              <video
                ref={(el) => (videoRefs.current[post._id] = el)}
                src={`http://localhost:8080${post.media.url}`}
                className="profile-post-video"
                onClick={() => handleVideoClick(post._id)} // ✅ Click to play/pause
                muted
              />
            ) : (
              <img
                src={`http://localhost:8080${post.media.url}`}
                alt="post"
                className="profile-post-img"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
