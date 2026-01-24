import React from "react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();
  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "0 20px",
    paddingTop: "60px", // Offset for Navbar
  };

  const badgeStyle = {
    padding: "8px 16px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "30px",
    color: "#c084fc",
    fontSize: "0.9rem",
    fontWeight: "500",
    marginBottom: "24px",
    display: "inline-block"
  };

  const h1Style = {
    fontSize: "clamp(3rem, 6vw, 5rem)",
    lineHeight: "1.1",
    margin: "0 0 24px 0",
    fontWeight: "800",
    letterSpacing: "-1px"
  };

  const pStyle = {
    fontSize: "1.25rem",
    color: "#94a3b8",
    maxWidth: "600px",
    lineHeight: "1.6",
    margin: "0 auto 40px auto"
  };

  return (
    <div id="hero" style={containerStyle}>
      <span style={badgeStyle}>✨ Welcome to the future of blogging</span>
      <h1 style={h1Style}>
        Discover stories that <br />
        <span className="text-gradient">matter to you.</span>
      </h1>
      <p style={pStyle}>
        Join a community of writers and readers who are shaping the future of digital storytelling. Share your voice with the world.
      </p>
      <div style={{ display: "flex", gap: "16px" }}>
        <button className="btn-primary" onClick={() => navigate("/explore")}>Start Reading</button>
        <button style={{
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          color: "white",
          padding: "10px 24px",
          borderRadius: "9999px",
          fontWeight: "600",
          cursor: "pointer"
        }}>Learn More</button>
      </div>
    </div>
  );
}
