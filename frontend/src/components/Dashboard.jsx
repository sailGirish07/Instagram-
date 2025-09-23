// components/Dashboard.jsx
import React from "react";
import "../public/styles/dashboared.CSS";
import HomeLink from "../Shared Components/HomeLink";
import SearchLink from "../Shared Components/SearchLink";
import MessagesLink from "../Shared Components/MessageLink";
import NotificationsLink from "../Shared Components/NotificationLink";
import ProfileLink from "../Shared Components/ProfileLink";

export default function Dashboard() {
  return (
    <div className="sidebar">
      <div className="logo">Instagram</div>
      <nav className="nav-menu">
        <ul>
          <HomeLink />
          <SearchLink />
          <MessagesLink />
          <NotificationsLink />
        </ul>
      </nav>
      <ProfileLink />
    </div>
  );
}
