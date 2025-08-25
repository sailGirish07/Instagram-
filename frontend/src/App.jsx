import React from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";
import { ForgotPassword } from "./components/ForgotPassword";
import Home from "./components/Home";
// import PostForm from "./components/PostForm";
import Profile from "./components/Profile";

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
      </Routes>
    </Router>
  );
}

export default App;
