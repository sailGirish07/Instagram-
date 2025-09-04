import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const wrapperRef = useRef(null);

  // Handle input change
  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:8080/search?query=${value}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResults(res.data);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  // Navigate to selected user's profile
  const goToProfile = (userId) => {
    setQuery("");
    setResults([]);
    navigate(`/user/${userId}`);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} style={{ position: "relative" }}>
      <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={handleSearch}
        style={{ padding: "8px", width: "220px" }}
      />

      {results.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "40px",
            left: 0,
            width: "100%",
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "6px",
            zIndex: 100,
            maxHeight: "300px",
            overflowY: "auto",
          }}
        >
          {results.map((user) => (
            <div
              key={user._id}
              onClick={() => goToProfile(user._id)}
              style={{
                padding: "8px",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
            >
              <img
                src={user.profilePic || "https://via.placeholder.com/40"}
                alt="profile"
                style={{
                  width: "35px",
                  height: "35px",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
              />
              <div>
                <strong>{user.userName}</strong>
                <div style={{ fontSize: "12px", color: "#555" }}>
                  {user.fullName}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {results.length === 0 && query.trim() !== "" && (
        <div
          style={{
            position: "absolute",
            top: "40px",
            left: 0,
            width: "100%",
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "6px",
            padding: "10px",
          }}
        >
          No users found
        </div>
      )}
    </div>
  );
}
