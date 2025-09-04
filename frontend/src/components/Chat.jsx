import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../public/styles/chat.css'; // updated CSS

const Chat = () => {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const token = localStorage.getItem('token');
  const userIdLoggedIn = localStorage.getItem('userId'); // current user id
  const chatBodyRef = useRef(null);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/messages/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);

        // scroll to bottom
        setTimeout(() => {
          chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }, 100);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    fetchMessages();
  }, [userId, token]);

  // Send message
  const handleSend = async () => {
    if (input.trim() === '') return;
    try {
      const res = await axios.post(
        `http://localhost:8080/messages/${userId}`,
        { text: input },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages([...messages, res.data]);
      setInput('');

      // scroll to bottom
      setTimeout(() => {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
      }, 50);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const otherUser = messages[0]?.sender?._id === userIdLoggedIn ? messages[0]?.receiver : messages[0]?.sender;

  return (
    <div className="chat-container">
      <div className="chat-header">
        <img
          src={otherUser?.profilePic || 'https://via.placeholder.com/40'}
          alt={otherUser?.userName}
          className="avatar"
        />
        <span className="chat-title">{otherUser?.userName || 'Chat'}</span>
      </div>

      <div className="chat-body" ref={chatBodyRef}>
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`chat-message ${msg.sender._id === userIdLoggedIn ? 'sent' : 'received'}`}
          >
            <div className="message-text">{msg.text}</div>
            <div className="message-time">
              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
