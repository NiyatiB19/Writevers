import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo_icon.png";


export default function Navbar({ theme, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  useLocation(); // Hook to trigger re-render on route change

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setIsAdmin(user.isAdmin || false);
      fetch(`http://localhost:5001/api/home/notifications/${user._id}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.read).length);
          }
        })
        .catch(err => console.error("Failed to load notifications", err));
    }
  }, [useLocation().key]); // Re-fetch on nav change

  const markRead = (id) => {
    fetch(`http://localhost:5001/api/home/notifications/${id}/read`, { method: 'PUT' });
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const removeNotification = (id) => {
    fetch(`http://localhost:5001/api/home/notifications/${id}`, { method: 'DELETE' })
      .then(res => {
         if (res.ok) {
            setNotifications(prev => prev.filter(n => n._id !== id));
            const removedNotification = notifications.find(n => n._id === id);
            if (removedNotification && !removedNotification.read) {
              setUnreadCount(prev => Math.max(0, prev - 1));
            }
         }
      })
      .catch(console.error);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

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
    background: scrolled ? theme === "light" 
      ? "rgba(249, 250, 251, 0.9)" 
      : "rgba(15, 23, 42, 0.9)" : "transparent",
    backdropFilter: scrolled ? "blur(12px)" : "none",
    borderBottom: scrolled ? `1px solid ${theme === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.05)"}` : "none",
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
        {/* logo size was previously 85px tall and appeared too large; shrink it here or
            apply a class if you want to control it via CSS */}
        <img
          src={logo}
          alt="WriteVerse"
          style={{ height: "40px", width: "auto", objectFit: "contain" }}
          className="app-logo"
        />
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
        <li><Link to="/" style={linkStyle} onMouseOver={(e) => e.target.style.color = theme === "light" ? "#1f2937" : "white"} onMouseOut={(e) => e.target.style.color = "var(--text-muted)"}>Home</Link></li>
        <li><Link to="/explore" style={linkStyle} onMouseOver={(e) => e.target.style.color = theme === "light" ? "#1f2937" : "white"} onMouseOut={(e) => e.target.style.color = "var(--text-muted)"}>Explore</Link></li>
        <li><Link to="/about" style={linkStyle} onMouseOver={(e) => e.target.style.color = theme === "light" ? "#1f2937" : "white"} onMouseOut={(e) => e.target.style.color = "var(--text-muted)"}>About Us</Link></li>
        {!isAdmin && <li><Link to="/profile" style={linkStyle} onMouseOver={(e) => e.target.style.color = theme === "light" ? "#1f2937" : "white"} onMouseOut={(e) => e.target.style.color = "var(--text-muted)"}>Profile</Link></li>}
        {localStorage.getItem("user") && (() => {
          try {
            const u = JSON.parse(localStorage.getItem("user"));
            if (u?.isAdmin) return <li><Link to="/admin" style={{ ...linkStyle, color: "var(--accent)" }} onMouseOver={(e) => e.target.style.color = "#a78bfa"} onMouseOut={(e) => e.target.style.color = "var(--accent)"}>Admin</Link></li>;
          } catch (_) {}
          return null;
        })()}


        {localStorage.getItem("token") && (
          <li style={{ position: "relative" }}>
            <span
              onClick={() => setShowNotifications(!showNotifications)}
              style={{ cursor: "pointer", fontSize: "1.2rem", position: "relative" }}
            >
              🔔
              {unreadCount > 0 && (
                <span style={{
                  position: "absolute", top: "-5px", right: "-5px", background: "red", color: "white",
                  fontSize: "0.7rem", borderRadius: "50%", width: "16px", height: "16px", display: "flex",
                  alignItems: "center", justifyContent: "center"
                }}>{unreadCount}</span>
              )}
            </span>
            {showNotifications && (
              <div className="glass" style={{
                position: "absolute", top: "40px", right: "-100px", width: "300px",
                background: theme === "light" ? "rgba(249, 250, 251, 0.95)" : "rgba(15, 23, 42, 0.95)",
                border: `1px solid ${theme === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(255,255,255,0.1)"}`,
                borderRadius: "12px", padding: "10px", zIndex: 1001, maxHeight: "400px", overflowY: "auto"
              }}>
                <h4 style={{ margin: "0 0 10px 0", color: "var(--text-main)", fontSize: "1rem", borderBottom: `1px solid ${theme === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(255,255,255,0.1)"}`, paddingBottom: "5px" }}>Notifications</h4>
                {notifications.length === 0 ? (
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", textAlign: "center" }}>No notifications</p>
                ) : (
                  notifications.map(n => (
                    <div key={n._id} onClick={() => markRead(n._id)} style={{
                      padding: "10px", borderBottom: `1px solid ${theme === "light" ? "rgba(0, 0, 0, 0.05)" : "rgba(255,255,255,0.05)"}`,
                      opacity: n.read ? 0.6 : 1, cursor: "pointer",
                      display: "flex", justifyContent: "space-between", alignItems: "center"
                    }}>
                      <div>
                        <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-main)" }}>{n.message}</p>
                        <small style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>{new Date(n.createdAt).toLocaleDateString()}</small>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeNotification(n._id); }} 
                        style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "1.2rem", padding: "0 5px" }}
                      >
                        &times;
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </li>
        )}
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
            background: theme === "light" ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.05)",
            border: `1px solid ${theme === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)"}`,
            padding: "8px 16px",
            borderRadius: "20px",
            color: "var(--text-main)",
            outline: "none",
            fontSize: "0.9rem",
            width: "200px",
            transition: "all 0.3s ease"
          }}
        />
        
        
        <button 
          className="theme-toggle"
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        {!isAdmin && <button className="btn-primary" onClick={() => {
          if (localStorage.getItem("token")) {
            navigate("/write");
          } else {
            alert("Please login to start writing.");
            navigate("/login");
          }
        }}>Start Writing</button>}

        {localStorage.getItem("token") && (
          <button 
            onClick={handleLogout}
            style={{
              background: "rgba(239, 68, 68, 0.2)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#ef4444",
              padding: "10px 20px",
              borderRadius: "9999px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              fontSize: "0.9rem"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(239, 68, 68, 0.3)";
              e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.5)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
              e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.3)";
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

