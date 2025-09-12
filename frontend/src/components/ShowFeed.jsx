// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../public/styles/showFeed.css";
// import chatIcon from "../assets/chat.png";
// import saveIcon from "../assets/bookmark.png";
// import sendIcon from "../assets/send.png";
// import heartIcon from "../assets/heart.png";
// import like from "../assets/like.png";
// import imgSave from "../assets/imgSaved.png";

// export default function ShowFeed() {
//   const [posts, setPosts] = useState([]);
//   const navigate = useNavigate();

//   const token = localStorage.getItem("token");
//   const userId = token ? JSON.parse(atob(token.split(".")[1])).userId : null;

//   const fetchFeedData = async () => {
//     try {
//       const res = await fetch("http://localhost:8080/api/v1/posts/feed-data", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const data = await res.json();
//       const { posts, savedPosts } = data;

//       const postsWithState = posts.map((post) => ({
//         ...post,

//          // ✅ Backend now sends `liked` & `likes` directly — no need to calculate
//         liked: post.liked, 
//         likes: post.likes, 

//         // liked: userId ? post.likes.includes(userId) : false,
//         saved: savedPosts?.includes(post._id) || false,
//         animate: false,
//         user: {
//           ...post.user,
//           profilePic: post.user?.profilePic
//             ? post.user.profilePic.startsWith("http")
//               ? post.user.profilePic
//               : `http://localhost:8080${post.user.profilePic}`
//             : "/default-avatar.png",
//         },
//         media: post.media?.startsWith("http")
//           ? post.media
//           : `http://localhost:8080${post.media}`,
//       }));

//       setPosts(postsWithState);
//     } catch (err) {
//       console.error("Error fetching feed data:", err);
//     }
//   };

//   useEffect(() => {
//     fetchFeedData();
//   }, []);

//   //Like toggle
//   const toggleLike = async (postId) => {
//     const token = localStorage.getItem("token");

//     // Instant UI update
//     setPosts((prevPosts) =>
//       prevPosts.map((post) => {
//         if (post._id === postId) {
//           const liked = !post.liked;
//           return {
//             ...post,
//             liked,
//             likes: liked ? post.likes + 1 : post.likes - 1,
//             animate: liked,
//           };
//         }
//         return post;
//       })
//     );

//     try {
//       const res = await fetch(
//         `http://localhost:8080/api/v1/posts/${postId}/like`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       const data = await res.json();

//       // Sync likes with server
//       setPosts((prevPosts) =>
//         prevPosts.map((post) =>
//           post._id === postId ? { ...post, likes: data.likes, liked: data.liked } : post
//         )
//       );
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   //Save toggle
//   const toggleSave = async (postId) => {
//     const token = localStorage.getItem("token");

//     setPosts((prev) =>
//       prev.map((post) =>
//         post._id === postId ? { ...post, saved: !post.saved } : post
//       )
//     );

//     try {
//       const res = await fetch(
//         `http://localhost:8080/api/v1/posts/${postId}/save`,
//         {
//           method: "PUT",
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       const data = await res.json();

//       // Sync with server
//       setPosts((prev) =>
//         prev.map((post) =>
//           post._id === postId ? { ...post, saved: data.saved } : post
//         )
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
//               src={post.user?.profilePic || "/default-avatar.png"}
//               alt="profile"
//               className="profile-pic"
//             />
//             <span className="username">{post.user?.userName}</span>
//           </div>

//           {/* Media */}
//           <div className="post-media">
//             <img src={post.media} alt="post-media" />
//           </div>

//           {/* Actions */}
//           <div className="post-actions">
//             <div className="left-actions">
//               <div className="heart-wrapper">
//                 <img
//                   src={post.liked ? like : heartIcon}
//                   alt="like"
//                   className={`action-icon heart-img ${
//                     post.animate ? "animate-like" : ""
//                   }`}
//                   onClick={() => toggleLike(post._id)}
//                 />
//                 <div className="post-likes">
//                   <b>{post.likes} likes</b>
//                 </div>
//               </div>
//               <img
//                 src={chatIcon}
//                 alt="comment"
//                 className="action-icon"
//                 onClick={() =>
//                   navigate(`/comments/${post._id}`, { state: { post } })
//                 }
//               />
//               <img
//                 src={sendIcon}
//                 alt="share"
//                 className="action-icon"
//                 onClick={() =>
//                   navigate("/messages", { state: { sharePost: post._id } })
//                 }
//               />
//             </div>

//             <div className="right-actions">
//               <img
//                 src={post.saved ? imgSave : saveIcon}
//                 alt="save"
//                 className="action-icon"
//                 onClick={() => toggleSave(post._id)}
//               />
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
import sendIcon from "../assets/send.png";
import heartIcon from "../assets/heart.png";
import like from "../assets/like.png";
import imgSave from "../assets/imgSaved.png";

export default function ShowFeed() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  // Fetch posts + saved posts together
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = token ? JSON.parse(atob(token.split(".")[1])).userId : null;

    const fetchPosts = async () => {
      try {
        // Fetch posts and saved posts simultaneously
        const [postsRes, savedRes] = await Promise.all([
          fetch("http://localhost:8080/api/v1/posts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:8080/api/v1/posts/saved", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const postsData = await postsRes.json();
        const savedPosts = await savedRes.json();
        const savedIds = savedPosts.map((p) => p._id);

        // Merge post state with saved & liked info
        const postsWithState = postsData.map((post) => ({
          ...post,
          liked: userId ? post.likes.includes(userId) : false,
          likes: post.likes.length,
          saved: savedIds.includes(post._id), // 
          animate: false,
          user: {
            ...post.user,
            profilePic: post.user?.profilePic
              ? post.user.profilePic.startsWith("http")
                ? post.user.profilePic
                : `http://localhost:8080${post.user.profilePic}`
              : "/default-avatar.png",
          },
          media: post.media?.startsWith("http")
            ? post.media
            : `http://localhost:8080${post.media}`,
        }));

        setPosts(postsWithState);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    fetchPosts();
  }, []);

  //Like toggle
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
            animate: liked,
          };
        }
        return post;
      })
    );

    try {
      const res = await fetch(`http://localhost:8080/api/v1/posts/${postId}/like`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      // Sync likes with server
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, likes: data.likes } : post
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  //Save toggle
  const toggleSave = async (postId) => {
    const token = localStorage.getItem("token");

    setPosts((prev) =>
      prev.map((post) =>
        post._id === postId ? { ...post, saved: !post.saved } : post
      )
    );

    try {
      const res = await fetch(`http://localhost:8080/api/v1/posts/${postId}/save`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      // Sync with server
      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId ? { ...post, saved: data.saved } : post
        )
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
                  navigate(`/comments/${post._id}`, { state: { post } })
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
              <img
                src={post.saved ? imgSave : saveIcon}
                alt="save"
                className="action-icon"
                onClick={() => toggleSave(post._id)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

