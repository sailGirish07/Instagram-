import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../public/styles/searchBar.css";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const wrapperRef = useRef(null);

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

  const goToProfile = (userId) => {
    setQuery("");
    setResults([]);
    navigate(`/user/${userId}`);
  };

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
    <div ref={wrapperRef} className="searchbar-wrapper">
      <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={handleSearch}
        className="searchbar-input"
      />

      {results.length > 0 && (
        <div className="searchbar-dropdown">
          {results.map((user) => (
            <div
              key={user._id}
              onClick={() => goToProfile(user._id)}
              className="searchbar-item"
            >
              <img
                src={user.profilePic || "https://via.placeholder.com/40"}
                alt="profile"
                className="searchbar-avatar"
              />
              <div className="searchbar-user-details">
                <strong>{user.userName}</strong>
                <div className="searchbar-user-fullname">{user.fullName}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {results.length === 0 && query.trim() !== "" && (
        <div className="searchbar-no-results">No users found</div>
      )}
    </div>
  );
}
