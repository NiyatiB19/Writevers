import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo_icon.png";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  useLocation(); // Hook to trigger re-render on route change to update auth state slightly better

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    padding: "10px 40px", // Reduced padding slightly
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 1000,
    transition: "all 0.3s ease",
    background: scrolled ? "rgba(15, 23, 42, 0.9)" : "transparent",
    backdropFilter: scrolled ? "blur(12px)" : "none",
    borderBottom: scrolled ? "1px solid rgba(255, 255, 255, 0.05)" : "none",
  };

  const logoStyle = {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    textDecoration: "none",
    gap: "10px"
  };

  const ulStyle = {
    display: "flex",
    gap: "30px",
    listStyle: "none",
    margin: 0,
    padding: 0,
    alignItems: "center"
  };

  const linkStyle = {
    cursor: "pointer",
    color: "var(--text-muted)",
    fontWeight: "500",
    transition: "color 0.2s ease",
    textDecoration: "none",
    fontSize: "0.95rem"
  };

  return (
    <nav style={navStyle}>
      <Link to="/" style={logoStyle}>
        <img src={logo} alt="WriteVerse" style={{ height: "85px", objectFit: "contain" }} />
        <span style={{
          fontSize: "1.8rem",
          fontWeight: "800",
          background: "linear-gradient(135deg, #4F46E5 0%, #EC4899 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "-0.5px",
          fontFamily: "'Outfit', sans-serif"
        }}>WriteVerse</span>
      </Link>
      <ul style={ulStyle}>
        <li><Link to="/" style={linkStyle} onMouseOver={(e) => e.target.style.color = "white"} onMouseOut={(e) => e.target.style.color = "var(--text-muted)"}>Home</Link></li>
        <li><Link to="/explore" style={linkStyle} onMouseOver={(e) => e.target.style.color = "white"} onMouseOut={(e) => e.target.style.color = "var(--text-muted)"}>Explore</Link></li>
        <li><Link to="/about" style={linkStyle} onMouseOver={(e) => e.target.style.color = "white"} onMouseOut={(e) => e.target.style.color = "var(--text-muted)"}>About Us</Link></li>
        <li><Link to="/profile" style={linkStyle} onMouseOver={(e) => e.target.style.color = "white"} onMouseOut={(e) => e.target.style.color = "var(--text-muted)"}>Profile</Link></li>
      </ul>

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <input
          type="text"
          placeholder="Search..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              navigate(`/explore?search=${e.target.value}`);
            }
          }}
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "8px 16px",
            borderRadius: "20px",
            color: "white",
            outline: "none",
            fontSize: "0.9rem",
            width: "200px"
          }}
        />
        <button className="btn-primary" onClick={() => {
          if (localStorage.getItem("token")) {
            navigate("/write");
          } else {
            alert("Please login to start writing.");
            navigate("/login");
          }
        }}>Start Writing</button>
      </div>
    </nav>
  );
}
