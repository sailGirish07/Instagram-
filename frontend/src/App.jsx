import React from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";
import { ForgotPassword } from "./components/ForgotPassword";
import Home from "./components/Home";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfil";
import Post from "./components/Post";
import UserProfile from "./components/UserProfile";
// import Messages from "./components/Messages";
import Chat from "./components/Chat";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/home" element={<Home/>}></Route>
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/post" element={<Post/>}/>
        <Route path="/user/:id" element={<UserProfile/>}/>
        {/* <Route path="/messages" element={<Messages/>}/> */}
        <Route path="/chat/:id" element={<Chat/>}/>
      </Routes>
    </Router>
  );
}

export default App;
