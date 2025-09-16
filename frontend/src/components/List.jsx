import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../public/styles/List.css";

export default function List() {
  const { type, userId } = useParams(); // type = 'followers' or 'following'
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch followers or following
  useEffect(() => {
    const fetchList = async () => {
      try {
        setLoading(true);
        let res;

        if (type === "followers") {
          res = await axios.get(
            `http://localhost:8080/api/v1/users/${userId}/followers`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } else if (type === "following") {
          res = await axios.get(
            `http://localhost:8080/api/v1/users/${userId}/following`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } else {
          throw new Error("Invalid list type");
        }

        setUsers(res.data); // array of users
      } catch (err) {
        console.error("Error fetching list:", err);
        alert("Failed to fetch list");
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, [type, userId, token]);

  // Unfollow a user
  const handleUnfollow = async (idToUnfollow) => {
    try {
      await axios.put(
        `http://localhost:8080/api/v1/users/${idToUnfollow}/unfollow`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Remove from UI immediately
      setUsers((prev) =>
        prev.filter((u) => (u.userId || u._id) !== idToUnfollow)
      );
    } catch (err) {
      console.error("Unfollow error:", err);
      alert("Failed to unfollow user");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="list-container">
      <h2>{type.charAt(0).toUpperCase() + type.slice(1)} of this user</h2>
      {users.length === 0 ? (
        <p>No {type} yet</p>
      ) : (
        <ul className="user-list">
          {users.map((u) => {
            const userIdValue = u.userId || u._id;
            return (
              <li
                key={userIdValue}
                className="user-item"
                // onClick={() => navigate(`/user/${userIdValue}`)}
              >
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
                  <button
                    className="btn message-btn"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent parent click
                      navigate(`/chat/${userIdValue}`);
                    }}
                  >
                    Message
                  </button>

                  <button
                    className="btn unfollow-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnfollow(userIdValue);
                    }}
                  >
                    Unfollow
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}


// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import "../public/styles/List.css";

// export default function List() {
//   const { type, userId } = useParams(); // type = 'followers' or 'following'
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");
//   const loggedInUser = JSON.parse(localStorage.getItem("user"));
//   const loggedInUserId = loggedInUser?._id;

//   // Fetch followers or following
//   useEffect(() => {
//     const fetchList = async () => {
//       try {
//         setLoading(true);
//         let res;

//         if (type === "followers") {
//           res = await axios.get(
//             `http://localhost:8080/api/v1/users/${userId}/followers`,
//             { headers: { Authorization: `Bearer ${token}` } }
//           );
//         } else if (type === "following") {
//           res = await axios.get(
//             `http://localhost:8080/api/v1/users/${userId}/following`,
//             { headers: { Authorization: `Bearer ${token}` } }
//           );
//         } else {
//           throw new Error("Invalid list type");
//         }

//         setUsers(res.data); // array of users
//       } catch (err) {
//         console.error("Error fetching list:", err);
//         alert("Failed to fetch list");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchList();
//   }, [type, userId, token]);

//   // Follow a user
//   const handleFollow = async (idToFollow) => {
//     try {
//       await axios.put(
//         `http://localhost:8080/api/v1/users/${idToFollow}/follow`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       // Update UI immediately
//       setUsers((prev) =>
//         prev.map((u) =>
//           (u.userId || u._id) === idToFollow ? { ...u, isFollowing: true } : u
//         )
//       );
//     } catch (err) {
//       console.error("Follow error:", err);
//       alert("Failed to follow user");
//     }
//   };

//   // Unfollow a user
//   const handleUnfollow = async (idToUnfollow) => {
//     try {
//       await axios.put(
//         `http://localhost:8080/api/v1/users/${idToUnfollow}/unfollow`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       // Update UI immediately
//       setUsers((prev) =>
//         prev.map((u) =>
//           (u.userId || u._id) === idToUnfollow ? { ...u, isFollowing: false } : u
//         )
//       );
//     } catch (err) {
//       console.error("Unfollow error:", err);
//       alert("Failed to unfollow user");
//     }
//   };

//   if (loading) return <p>Loading...</p>;

//   return (
//     <div className="list-container">
//       <h2>{type.charAt(0).toUpperCase() + type.slice(1)} of this user</h2>
//       {users.length === 0 ? (
//         <p>No {type} yet</p>
//       ) : (
//         <ul className="user-list">
//           {users.map((u) => {
//             const userIdValue = u.userId || u._id;
//             const isSelf = userIdValue === loggedInUserId;
//             const isFollowing = u.isFollowing || false;

//             // Determine which buttons to show
//             let showFollow = false;
//             let showUnfollow = false;
//             let showMessage = true;

//             if (isSelf) {
//               if (type === "following") showUnfollow = true;
//             } else {
//               if (!isFollowing) showFollow = true;
//             }

//             return (
//               <li key={userIdValue} className="user-item">
//                 <img
//                   src={u.profilePic || "https://via.placeholder.com/50"}
//                   alt={u.userName}
//                   className="user-img"
//                 />
//                 <div className="user-info">
//                   <span className="user-name">{u.userName}</span>
//                   <span className="user-fullName">{u.fullName}</span>
//                 </div>
//                 <div className="user-actions">
//                   {showFollow && (
//                     <button
//                       className="btn follow-btn"
//                       onClick={() => handleFollow(userIdValue)}
//                     >
//                       Follow
//                     </button>
//                   )}

//                   {showUnfollow && (
//                     <button
//                       className="btn unfollow-btn"
//                       onClick={() => handleUnfollow(userIdValue)}
//                     >
//                       Unfollow
//                     </button>
//                   )}

//                   {showMessage && (
//                     <button
//                       className="btn message-btn"
//                       onClick={() => navigate(`/chat/${userIdValue}`)}
//                     >
//                       Message
//                     </button>
//                   )}
//                 </div>
//               </li>
//             );
//           })}
//         </ul>
//       )}
//     </div>
//   );
// }
