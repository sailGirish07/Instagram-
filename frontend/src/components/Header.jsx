import React from "react";
import '../public/styles/header.css'

export default function Header(){
    return(
          <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>Instagram</h1>
        </div>
        
        <div className="auth-buttons">
          <button className="login-btn">Log in</button>
          <button className="signup-btn">Sign up</button>
        </div>
      </div>
    </header>
    )
}