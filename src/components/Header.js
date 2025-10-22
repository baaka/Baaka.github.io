import React, { useEffect } from "react";
import SearchField from "./SearchField";
import "./Header.css";
import logo from "../assets/images/main_logo.png"; // Import the main logo image

const Header = ({ onSearch }) => {
  useEffect(() => {
    const handleScrollEffect = () => {
      const header = document.querySelector(".header");
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScrollEffect);
    return () => window.removeEventListener("scroll", handleScrollEffect);
  }, []);

  // Handle search submission
  const handleSearch = (query) => {
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <header className="header">
      {/* Left: Logo */}
      <div className="header-left">
        <img src={logo} alt="New Looker Logo" className="header-logo" />
      </div>

      {/* Center: Search field */}
      <div className="header-center">
        <SearchField onSearch={handleSearch} />
      </div>
    </header>
  );
};

export default Header;
