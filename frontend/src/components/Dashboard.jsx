import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import "../public/styles/dashboared.CSS"
import SearchBar from './SearchBar';

export default function Dashboard() {
  const navigate = useNavigate();
  const[showSearch, setShowSearch] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    navigate("/login"); 
  };

  return (
    <div className="sidebar">
      <div className="logo">Instagram</div>
      <nav className="nav-menu">
        <ul>
          
          <li onClick={() => navigate("/home")}>
            <i className="fas fa-home"></i> Home
          </li>
          
             {/* <li> */}
            {/* <i className="fa-solid fa-magnifying-glass"></i> Search
            <SearchBar />
          </li> */}
           {/* Search icon */}
          <li onClick={() => setShowSearch(!showSearch)}>
            <i className="fa-solid fa-magnifying-glass"></i> Search
          </li>
           {showSearch && <SearchBar />}
          {/* <li>
             <i className="far fa-paper-plane"></i>
            <span>Messages</span>
          </li> */}
          <li onClick={() => navigate("/messages")}>
  <i className="far fa-paper-plane"></i>
  <span>Messages</span>
</li>
          <li>
             <i className="far fa-heart"></i>
            <span>Notifications</span>
          </li>
        </ul>
      </nav>

     
     <div className="profile-link" onClick={() => navigate("/profile")}>
        <i className="fas fa-user-circle profile"></i> Profile
      </div>

      <div className="logout-link" onClick={handleLogout}>
        <i className="fas fa-sign-out-alt"></i>
        <span>Logout</span>
      </div>
    </div>
  );
}

