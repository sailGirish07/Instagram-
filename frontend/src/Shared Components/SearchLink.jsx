import React, { useState } from "react";
import SearchBar from "../components/SearchBar";

export default function SearchLink() {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <>
      <li onClick={() => setShowSearch(!showSearch)} className="search-link">
        <i className="fa-solid fa-magnifying-glass"></i> Search
      </li>
      {showSearch && <SearchBar />}
    </>
  );
}
