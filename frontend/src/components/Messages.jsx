import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import "../public/styles/messages.css";

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/messages/conversations",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setConversations(res.data);
      } catch (err) {
        console.error("Failed to fetch conversations:", err);
      }
    };
    fetchConversations();
  }, [token]);

  return (
    <div className="messages-container">
      <SearchBar />
      {/* Conversations list */}
      <div className="conversations-list">
        <p>Messages</p>
        {conversations.length === 0 ? (
          <p className="no-chats">No chats yet</p>
        ) : (
          conversations.map((conv) => {
            const otherUser = conv.participants.find(
              (u) => u._id !== conv.loggedInUser
            );
            const lastMessage = conv.lastMessage;

            return (
              <div
                key={otherUser._id}
                onClick={() => navigate(`/chat/${otherUser._id}`)}
                className="conversation-item"
              >
                <img
                  src={otherUser.profilePic || "https://via.placeholder.com/40"}
                  alt={otherUser.userName}
                  className="conversation-avatar"
                />
                <div className="conversation-details">
                  <strong>{otherUser.userName}</strong>
                  <p className="last-message">
                    {lastMessage ? lastMessage.text : "No messages yet"}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
