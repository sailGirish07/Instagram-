import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import "../public/styles/messages.css";

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const sharedPostId = location.state?.sharePost;

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/v1/messages/conversations",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setConversations(res.data);
      } catch (err) {
        console.error("Failed to fetch conversations:", err);
      }
    };
    fetchConversations();
  }, [token]);

  //  Send shared post when chat clicked
  const handleChatClick = async (otherUserId) => {
    if (sharedPostId) {
      try {
        await axios.post(
          `http://localhost:8080/api/v1/messages/${otherUserId}`,
          { post: sharedPostId }, // sending post as message
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("Failed to share post:", err);
      }
    }

    navigate(`/chat/${otherUserId}`); // navigate to chat
  };
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
                onClick={() => handleChatClick(otherUser._id)}
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
