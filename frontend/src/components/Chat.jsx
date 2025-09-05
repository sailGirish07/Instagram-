import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../public/styles/chat.css";

export default function Chat() {
  const { id: receiverId } = useParams(); // receiver id from route
  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState(null);
  const [input, setInput] = useState("");
  const chatBodyRef = useRef(null);
  const token = localStorage.getItem("token");

  // Scroll to bottom
  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatBodyRef.current) {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
      }
    }, 100);
  };

  // Fetch messages and receiver info
  useEffect(() => {
    const fetchData = async () => {
      try {
        const messagesRes = await axios.get(
          `http://localhost:8080/messages/${receiverId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(messagesRes.data);

        if (messagesRes.data.length > 0) {
          const first = messagesRes.data[0];
          const user =
            first.sender._id === receiverId ? first.sender : first.receiver;
          setReceiver(user);
        } else {
          const userRes = await axios.get(
            `http://localhost:8080/user/${receiverId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setReceiver(userRes.data.user);
        }

        scrollToBottom();
      } catch (err) {
        console.error("Fetch chat error:", err);
      }
    };

    fetchData();
  }, [receiverId, token]);

  // Send message
  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      const res = await axios.post(
        `http://localhost:8080/messages/${receiverId}`,
        { text: input },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages((prev) => [...prev, res.data]);
      setInput("");
      scrollToBottom();
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        {receiver ? (
          <>
            <img
              src={receiver.profilePic || "https://via.placeholder.com/40"}
              alt={receiver.userName}
              className="avatar"
            />
            <span className="chat-title">{receiver.userName}</span>
          </>
        ) : (
          <span className="chat-title">Loading...</span>
        )}
      </div>

      {/* Messages */}
      <div className="chat-body" ref={chatBodyRef}>
        {messages.length === 0 ? (
          <div className="empty">Start typing...</div>
        ) : (
          messages.map((msg, i) => {
            const isSent = msg.sender._id !== receiverId; // true if logged-in user sent it
            const senderImage =
              msg.sender.profilePic || "https://via.placeholder.com/30";

            return (
              <div
                key={i}
                className={`message-row ${isSent ? "sent" : "received"}`}
              >
                {/* Show avatar for both sent and received */}
                <img
                  src={senderImage}
                  alt={msg.sender.userName}
                  className="message-avatar"
                />
                <div className="message">
                  <p>{msg.text}</p>
                  <span className="time">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
