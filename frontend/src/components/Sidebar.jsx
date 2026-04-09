import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5001";

export default function Sidebar({ trending, writers }) {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState(() => {
    // Initialize from props to avoid "no data" flicker on first render.
    let parsedUser = null;
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        parsedUser = JSON.parse(userStr);
      } catch {
        parsedUser = null;
      }
    }

    const currentUserId = parsedUser?._id?.toString?.();
    const followingSet = new Set((parsedUser?.following || []).map(String));

    return (writers || []).filter(writer => {
      const id = writer?._id?.toString?.() ?? String(writer?._id);
      if (currentUserId && id === currentUserId) return false;
      if (followingSet.has(id)) return false;
      return true;
    });
  });
  const [pendingFollowId, setPendingFollowId] = useState(null);

  useEffect(() => {
    // Keep the list filtered in case the backend didn't (or localStorage is stale).
    let parsedUser = null;
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        parsedUser = JSON.parse(userStr);
      } catch {
        parsedUser = null;
      }
    }

    const currentUserId = parsedUser?._id?.toString?.();
    const followingSet = new Set((parsedUser?.following || []).map(String));

    setSuggestions((writers || []).filter(writer => {
      const id = writer?._id?.toString?.() ?? String(writer?._id);
      if (currentUserId && id === currentUserId) return false;
      if (followingSet.has(id)) return false;
      return true;
    }));
  }, [writers]);

  if (!trending && !writers) return null;

  const handleFollow = async (writer) => {
    if (!writer?._id) return;
    const targetUserId = writer._id.toString();
    if (pendingFollowId) return;

    const userStr = localStorage.getItem("user");
    if (!userStr) return navigate("/login");

    let user = null;
    try {
      user = JSON.parse(userStr);
    } catch {
      user = null;
    }

    if (!user?._id) return navigate("/login");

    const currentUserId = user._id;

    setPendingFollowId(targetUserId);
    try {
      const res = await fetch(`${API_BASE}/api/home/follow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentUserId, targetUserId })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Follow failed");

      const following = (data?.following || []).map(String);
      if (following.includes(targetUserId)) {
        // Real-time update: remove the followed user from suggestions.
        setSuggestions(prev => prev.filter(w => w?._id?.toString?.() !== targetUserId));
      }

      const updatedUser = { ...user, following: data.following };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Follow failed:", err);
    } finally {
      setPendingFollowId(null);
    }
  };

  return (
    <aside style={{
      flex: "0 0 350px",
      display: "flex",
      flexDirection: "column",
      gap: "30px",
      height: "fit-content",
      position: "sticky",
      top: "100px" // Spacing from sticky navbar
    }}>

      {/* Trending Section */}
      <div className="glass" style={{ padding: "24px", borderRadius: "20px" }}>
        <h4 style={{ margin: "0 0 20px 0", fontSize: "1.1rem" }}>Trending Stories</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {trending && trending.length > 0 ? (
            trending.map((item, index) => (
              <div key={index} style={{ display: "flex", gap: "12px", alignItems: "baseline" }}>
                <span style={{ fontSize: "1.5rem", fontWeight: "800", color: "rgba(255,255,255,0.1)", lineHeight: 1 }}>0{index + 1}</span>
                <div>
                  <Link to={`/read/${item._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <p
                      style={{ margin: "0 0 4px 0", fontWeight: "500", fontSize: "0.95rem", cursor: "pointer", transition: "color 0.2s" }}
                      onMouseOver={(e) => e.target.style.color = "#818cf8"}
                      onMouseOut={(e) => e.target.style.color = "var(--text-main)"}
                    >
                      {item.title}
                    </p>
                  </Link>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{item.views} reads</span>
                </div>
              </div>
            ))
          ) : (
            <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-muted)", fontStyle: "italic" }}>
              No trending stories available.
            </p>
          )}
        </div>
      </div>

      {/* Writers Section */}
      <div className="glass" style={{ padding: "24px", borderRadius: "20px" }}>
        <h4 style={{ margin: "0 0 20px 0", fontSize: "1.1rem" }}>Writers to Follow</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {suggestions && suggestions.length > 0 ? (
            suggestions.map((writer, index) => (
              <div key={index} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <img src={writer.avatar} alt={writer.name} style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} />
                  <div>
                    <p style={{ margin: 0, fontWeight: "600", fontSize: "0.9rem" }}>{writer.name}</p>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-muted)" }}>{writer.followers} followers</p>
                  </div>
                </div>
                <button
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "var(--text-main)",
                    borderRadius: "20px",
                    padding: "6px 14px",
                    fontSize: "0.75rem",
                    cursor: "pointer"
                  }}
                  onClick={() => handleFollow(writer)}
                >
                  Follow
                </button>
              </div>
            ))
          ) : (
            <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-muted)", fontStyle: "italic" }}>
              No writers to follow right now.
            </p>
          )}
        </div>
      </div>

    </aside>
  );
}
