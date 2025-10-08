import React, { useState, useEffect } from "react";
import SearchField from "./SearchField";
import "./Header.css";
import logo from "../assets/images/logo.svg"; // Import the logo image

const Header = ({ onSearch }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("main");

  // Highlight active section on scroll
  const handleScroll = () => {
    const sections = ["main", "products", "contact"];
    const scrollPos = window.scrollY + 100; // offset for header
    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(sections[i]);
      if (el && scrollPos >= el.offsetTop) {
        setActiveSection(sections[i]);
        break;
      }
    }
  };

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

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false); // triggers useEffect to remove class
  };

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
        <div className="logo">
          <img src={logo} alt="New Looker Logo" />
        </div>
        <h1 className="logo-text">NEW LOOKER</h1>
      </div>

      {/* Center: Search field */}
      <div className="header-center">
        <SearchField onSearch={handleSearch} />
      </div>

      {/* Right: Nav links + hamburger */}
      <div className="header-right">
        <nav className={`nav ${menuOpen ? "open" : ""}`}>
          <a
            className={activeSection === "main" ? "active" : ""}
            onClick={() => scrollTo("main")}
          >
            Main
          </a>
          <a
            className={activeSection === "products" ? "active" : ""}
            onClick={() => scrollTo("products")}
          >
            Products
          </a>
          <a
            className={activeSection === "contact" ? "active" : ""}
            onClick={() => scrollTo("contact")}
          >
            Contact
          </a>
        </nav>

        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
