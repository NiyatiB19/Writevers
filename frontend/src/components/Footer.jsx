import React from "react";

export default function Footer() {
  return (
    <footer style={{
      marginTop: "80px",
      padding: "60px 20px",
      background: "var(--bg-card)",
      borderTop: "1px solid rgba(255,255,255,0.05)"
    }}>
      <div className="container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "40px" }}>

        {/* Brand */}
        <div>
          <h3 style={{
            margin: "0 0 20px 0",
            fontSize: "1.5rem",
            fontWeight: "800",
            background: "linear-gradient(to right, #c084fc, #6366f1)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>WriteVerse</h3>
          <p style={{ color: "var(--text-muted)", lineHeight: "1.6" }}>
            Empowering writers and readers to connect through the power of words. Join the revolution today.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 style={{ margin: "0 0 20px 0" }}>Explore</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px", color: "var(--text-muted)" }}>
            <li>Trending</li>
            <li>Most Recent</li>
            <li>Technology</li>
            <li>Lifestyle</li>
          </ul>
        </div>

        <div>
          <h4 style={{ margin: "0 0 20px 0" }}>Company</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px", color: "var(--text-muted)" }}>
            <li>About Us</li>
            <li>Careers</li>
            <li>Support</li>
            <li>Terms of Service</li>
          </ul>
        </div>

        <div>
          <h4 style={{ margin: "0 0 20px 0" }}>Newsletter</h4>
          <div style={{ display: "flex", gap: "10px" }}>
            <input type="email" placeholder="Your email" style={{
              background: "rgba(0,0,0,0.2)",
              border: "1px solid rgba(255,255,255,0.1)",
              padding: "10px 16px",
              borderRadius: "8px",
              color: "white",
              outline: "none",
              width: "100%"
            }} />
            <button className="btn-primary" style={{ padding: "10px 16px", borderRadius: "8px" }}>Subscribe</button>
          </div>
        </div>

      </div>

      <div style={{ textAlign: "center", marginTop: "60px", color: "var(--text-muted)", fontSize: "0.9rem" }}>
        &copy; {new Date().getFullYear()} WriteVerse. All rights reserved.
      </div>
    </footer>
  );
}
