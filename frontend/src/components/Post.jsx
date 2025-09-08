// // import React, { useState, useEffect } from "react";
// // import axios from "axios";
// // import "../public/styles/post.css";

// // export default function PostCard({ post, token }) {
// //   const [liked, setLiked] = useState(false);
// //   const [likesCount, setLikesCount] = useState(post.likes.length);

// //   useEffect(() => {
// //     // Check if current user already liked this post
// //     const userId = localStorage.getItem("userId");
// //     setLiked(post.likes.includes(userId));
// //   }, [post.likes]);

// //   const handleLike = async () => {
// //     try {
// //       const res = await axios.put(
// //         `http://localhost:8080/posts/${post._id}/like`,
// //         {},
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );

// //       setLikesCount(res.data.likes);
// //       setLiked(!liked); // toggle heart
// //     } catch (err) {
// //       console.error("Error liking post:", err);
// //     }
// //   };

// //   return (
// //     <div className="post-card">
// //       <img src={`http://localhost:8080${post.media}`} alt="post" />
// //       <div className="post-actions">
// //         <i className={`fa-solid fa-heart ${liked ? "liked" : ""}`}
// //          onClick={handleLike}
// //          ></i>
// //         <span>{likesCount}</span>
// //       </div>
// //       <p>{post.caption}</p>
// //     </div>
// //   );
// // }



// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "../public/styles/post.css";

// export default function Post({ post, token }) {
//   // ✅ Handle undefined post
//   const [liked, setLiked] = useState(false);
//   const [likesCount, setLikesCount] = useState(0);

//   useEffect(() => {
//     if (!post) return;

//     const userId = localStorage.getItem("userId");
//     setLiked(post.likes?.includes(userId));
//     setLikesCount(post.likes?.length || 0);
//   }, [post]);

//   const handleLike = async () => {
//     if (!post) return;

//     try {
//       const res = await axios.put(
//         `http://localhost:8080/posts/${post._id}/like`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setLikesCount(res.data.likes.length);
//       const userId = localStorage.getItem("userId");
//       setLiked(res.data.likes.includes(userId));
//     } catch (err) {
//       console.error("Error liking post:", err);
//     }
//   };

//   if (!post) return null; // or a loading placeholder

//   return (
//     <div className="post-card">
//       <img src={`http://localhost:8080${post.media}`} alt="post" />
//       <div className="post-actions">
//         <i
//           className={`fa-solid fa-heart ${liked ? "liked" : ""}`}
//           onClick={handleLike}
//         ></i>
//         <span>{likesCount}</span>
//       </div>
//       <p>{post.caption}</p>
//     </div>
//   );
// }

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../public/styles/post.css";

export default function CreatePost() {
  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!media) return alert("Please upload an image/video");

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("media", media);

    try {
      await axios.post("http://localhost:8080/posts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/profile"); // redirect to profile after posting
    } catch (err) {
      console.error("Error creating post:", err);
      alert("Failed to create post");
    }
  };

  return (
    <div className="create-post-container">
      <h2>Create a Post</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setMedia(e.target.files[0])}
          required
        />
        <textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <button type="submit">Post</button>
      </form>
    </div>
  );
}
