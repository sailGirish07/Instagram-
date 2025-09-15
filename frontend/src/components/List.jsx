import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import '../public/styles/List.css'


export default function List() {
  const { type, userId } = useParams(); // type = 'followers' or 'following'
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

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

        setUsers(res.data); // res.data = array of users
      } catch (err) {
        console.error("Error fetching list:", err);
        alert("Failed to fetch list");
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, [type, userId, token]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="list-container">
      <h2>
        {type.charAt(0).toUpperCase() + type.slice(1)} of this user
      </h2>
      {users.length === 0 ? (
        <p>No {type} yet</p>
      ) : (
        <ul className="user-list">
          {users.map((u) => (
            <li
              key={u.userId || u._id} // In case you store userId object
              className="user-item"
              onClick={() => navigate(`/user/${u.userId || u._id}`)} // Go to that user's profile
            >
              <img
                src={u.profilePic || "https://via.placeholder.com/50"}
                alt={u.userName}
                className="user-img"
              />
              <span className="user-name">{u.userName}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
