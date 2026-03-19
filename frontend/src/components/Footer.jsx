import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={{
      marginTop: "100px",
      padding: "80px 0 40px",
      background: "var(--bg-dark)",
      borderTop: "var(--border-glass)",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Decorative background blur */}
      <div style={{
        position: "absolute", top: "-100px", left: "20%", width: "200px", height: "200px",
        background: "rgba(99, 102, 241, 0.15)", borderRadius: "50%", filter: "blur(80px)"
      }}></div>

      <div className="container" style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "40px",
        flexWrap: "wrap",
        position: "relative",
        zIndex: 1
      }}>

        {/* Brand Section */}
        <div>
          <h3 style={{
            margin: "0 0 24px 0",
            fontSize: "2rem",
            fontWeight: "800",
            background: "linear-gradient(to right, #c084fc, #6366f1)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-1px"
          }}>WriteVerse</h3>
          <p style={{ color: "#94a3b8", lineHeight: "1.7", marginBottom: "30px", fontSize: "1.05rem" }}>
            A premium digital publishing platform for storytellers, thinkers, and creators.
            Connect with a global audience and share your voice.
          </p>

          {/* Social Icons (Simulated) */}
          <div style={{ display: "flex", gap: "16px" }}>
            {['Twitter', 'GitHub', 'LinkedIn', 'Instagram'].map(social => (
              <a key={social} href="#" style={{
                width: "40px", height: "40px", borderRadius: "12px",
                background: "var(--bg-glass)", border: "var(--border-glass)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--text-main)", textDecoration: "none", fontSize: "0.9rem",
                transition: "all 0.3s ease"
              }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "var(--bg-glass)";
                  e.currentTarget.style.color = "var(--accent)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "var(--bg-glass)";
                  e.currentTarget.style.color = "var(--text-main)";
                }}>
                {social[0]}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ margin: "0 0 24px 0", fontSize: "1.1rem", fontWeight: "600" }}>Platform</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "16px", color: "var(--text-muted)" }}>
            <li><Link to="/" style={{ color: "inherit", textDecoration: "none", transition: "color 0.2s" }} onMouseOver={e => e.target.style.color = "var(--text-main)"} onMouseOut={e => e.target.style.color = "inherit"}>Home</Link></li>
            <li><Link to="/explore" style={{ color: "inherit", textDecoration: "none", transition: "color 0.2s" }} onMouseOver={e => e.target.style.color = "var(--text-main)"} onMouseOut={e => e.target.style.color = "inherit"}>Explore Topics</Link></li>
            <li><Link to="/write" style={{ color: "inherit", textDecoration: "none", transition: "color 0.2s" }} onMouseOver={e => e.target.style.color = "var(--text-main)"} onMouseOut={e => e.target.style.color = "inherit"}>Start Writing</Link></li>
            <li><Link to="/about" style={{ color: "inherit", textDecoration: "none", transition: "color 0.2s" }} onMouseOver={e => e.target.style.color = "var(--text-main)"} onMouseOut={e => e.target.style.color = "inherit"}>About Us</Link></li>
          </ul>
        </div>

        {/* Legal / Contact */}
        <div>
          <h4 style={{ margin: "0 0 24px 0", fontSize: "1.1rem", fontWeight: "600" }}>Legal & Support</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "16px", color: "var(--text-muted)" }}
          >
            <li><a href="#" style={{ color: "inherit", textDecoration: "none" }}>Privacy Policy</a></li>
            <li><a href="#" style={{ color: "inherit", textDecoration: "none" }}>Terms of Service</a></li>
            <li><a href="#" style={{ color: "inherit", textDecoration: "none" }}>Cookie Policy</a></li>
            <li><a href="#" style={{ color: "inherit", textDecoration: "none" }}>Help Center</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 style={{ margin: "0 0 24px 0", fontSize: "1.1rem", fontWeight: "600" }}>Stay Updated</h4>
          <p style={{ color: "var(--text-muted)", marginBottom: "20px", fontSize: "0.95rem" }}>
            Get the latest stories and updates delivered straight to your inbox.
          </p>
          <form style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input type="email" placeholder="Enter your email" style={{
              background: "var(--bg-glass)",
              border: "var(--border-glass)",
              padding: "14px 20px",
              borderRadius: "12px",
              color: "var(--text-main)",
              outline: "none",
              fontSize: "1rem"
            }} />
            <button className="btn-primary" style={{ padding: "14px", borderRadius: "12px", fontWeight: "600" }}>Subscribe Now</button>
          </form>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="container" style={{
        marginTop: "80px",
        paddingTop: "30px",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "20px",
        color: "#64748b",
        fontSize: "0.9rem"
      }}>
        <div>&copy; {new Date().getFullYear()} WriteVerse Inc. All rights reserved.</div>
        <div style={{ display: "flex", gap: "30px" }}>
          <span>Made with ❤️ for writers.</span>
        </div>
      </div>
    </footer>
  );
}
