import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./Pages/Login";
import { Signup } from "./Pages/Signup";
import { ForgotPassword } from "./components/ForgotPassword";
import Home from "./Pages/Home";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfil";
import Post from "./components/Post";
import UserProfile from "./components/UserProfile";
import Messages from "./components/Messages";
import Chat from "./components/Chat";
import Notification from "./components/Notification";
import Comments from "./components/Comments";
import Menu from "./components/Menu";
import Save from "./components/Save";
import List from "./components/List";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/home" element={<Home />}></Route>
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/post" element={<Post />} />
        <Route path="/user/:id" element={<UserProfile />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/chat/:id" element={<Chat />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/comments/:postId" element={<Comments />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/saved" element={<Save />} />
        <Route path="/list/:type/:userId" element={<List/>}/>
      </Routes>
    </Router>
  );
}

export default App;
