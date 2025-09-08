// import React, { useState, useEffect } from "react";
// import "../public/styles/showFeed.css";
// import chatIcon from "../assets/chat.png";
// import saveIcon from "../assets/bookmark.png";
// import heartIcon from "../assets/heart.png";
// import sendIcon from "../assets/send.png";

// export default function ShowFeed() {
//   const [posts, setPosts] = useState([]);
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const userId = token ? JSON.parse(atob(token.split(".")[1])).userId : null;

//     fetch("http://localhost:8080/posts", {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         const postsWithLiked = data.map((post) => ({
//           ...post,
//           liked: userId ? post.likes.includes(userId) : false,
//           likes: post.likes || [],
//         }));
//         setPosts(postsWithLiked);
//       })
//       .catch((err) => console.error(err));
//   }, []);

//   const toggleLike = async (postId) => {
//     const token = localStorage.getItem("token");
//     try {
//       const res = await fetch(`http://localhost:8080/posts/${postId}/like`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const data = await res.json();

//       setPosts(
//         posts.map((post) => {
//           if (post._id === postId) {
//             return {
//               ...post,
//               liked: !post.liked,
//               likes: data.likes,
//             };
//           }
//           return post;
//         })
//       );
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="feed">
//       {posts.map((post) => (
//         <div key={post._id} className="post">
//           {/* User Info */}
//           <div className="post-header">
//             <img
//               src={
//                 post.user?.profilePic
//                   ? `http://localhost:8080${post.user.profilePic}`
//                   : "/default-avatar.png"
//               }
//               alt="profile"
//               className="profile-pic"
//             />
//             <span className="username">{post.user?.userName}</span>
//           </div>

//           {/* Media */}
//           <div className="post-media">
//             <img src={`http://localhost:8080${post.media}`} alt="post-media" />
//           </div>

//           <div className="post-actions">
//             <div className="left-actions">
//               <div className="heart-wrapper">
//                 <img
//                   src={heartIcon}
//                   alt="like"
//                   className={`action-icon heart-icon ${
//                     post.liked ? "liked" : ""
//                   }`}
//                   onClick={() => toggleLike(post._id)}
//                 />
//                 <div className="post-likes">
//                   <b>{post.likes.length} likes</b>
//                 </div>
//               </div>

//               <img src={chatIcon} alt="comment" className="action-icon" />
//               <img src={sendIcon} alt="share" className="action-icon" />
//             </div>
//             <div className="right-actions">
//               <img src={saveIcon} alt="save" className="action-icon" />
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../public/styles/showFeed.css";
import chatIcon from "../assets/chat.png";
import saveIcon from "../assets/bookmark.png";
import heartIcon from "../assets/heart.png";
import sendIcon from "../assets/send.png";

export default function ShowFeed() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = token ? JSON.parse(atob(token.split(".")[1])).userId : null;

    fetch("http://localhost:8080/posts", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const postsWithLiked = data.map((post) => {
          // ✅ Normalize user profilePic
          let profilePic = "/default-avatar.png";
          if (post.user?.profilePic) {
            profilePic = post.user.profilePic.startsWith("http")
              ? post.user.profilePic
              : `http://localhost:8080${post.user.profilePic}`;
          }

          // ✅ Normalize post media
          let media = post.media;
          if (media && !media.startsWith("http")) {
            media = `http://localhost:8080${media}`;
          }

          return {
            ...post,
            liked: userId ? post.likes.includes(userId) : false,
            likes: post.likes || [],
            user: {
              ...post.user,
              profilePic,
            },
            media,
          };
        });

        setPosts(postsWithLiked);
      })
      .catch((err) => console.error(err));
  }, []);

  const toggleLike = async (postId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:8080/posts/${postId}/like`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      setPosts(
        posts.map((post) => {
          if (post._id === postId) {
            return {
              ...post,
              liked: !post.liked,
              likes: data.likes,
            };
          }
          return post;
        })
      );
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
              src={post.user?.profilePic || "/default-avatar.png"} // ✅ already normalized
              alt="profile"
              className="profile-pic"
            />
            <span className="username">{post.user?.userName}</span>
          </div>

          {/* Media */}
          <div className="post-media">
            <img src={post.media} alt="post-media" /> {/* ✅ already normalized */}
          </div>

          <div className="post-actions">
            <div className="left-actions">
              <div className="heart-wrapper">
                <img
                  src={heartIcon}
                  alt="like"
                  className={`action-icon heart-icon ${post.liked ? "liked" : ""}`}
                  onClick={() => toggleLike(post._id)}
                />
                <div className="post-likes">
                  <b>{post.likes.length} likes</b>
                </div>
              </div>

              <img src={chatIcon} alt="comment" className="action-icon" />
              <img src={sendIcon} alt="share" className="action-icon"
              onClick={() => navigate('/messages', {state: {sharePost : post._id}})} />
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
