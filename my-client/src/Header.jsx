import { useState } from "react";
import "./styles/header.css";

const RenderHeader = () => {
  const handleSearchSubmit = (e) => {

    //
  };

  return (
    <header className="header-container">
      <div className="logo">
        <img src="/src/assets/logo.png" />
      </div>
      <div className="search">
        <input placeholder="Search" className="search-input" />
        <button>Search</button>
      </div>
      <nav className="nav-menu-container">
        <ul className="nav-menu">
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
      </nav>
      <div className="login">Login</div>
    </header>
  );
};

export default RenderHeader;
