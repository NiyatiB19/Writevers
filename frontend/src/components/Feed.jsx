import React from "react";
import { Link } from "react-router-dom";

export default function Feed({ posts }) {
  if (!posts) return null;

  return (
    <div id="feed" style={{ width: "100%" }}>
      <h3 style={{ fontSize: "1.5rem", marginBottom: "30px" }}>Latest Reads</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
        {posts.map((post) => (
          <div key={post.id} className="glass" style={{
            borderRadius: "20px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            transition: "transform 0.2s"
          }}>
            {post.image && (
              <div style={{
                height: "240px",
                width: "100%",
                backgroundImage: `url(${post.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
              }} />
            )}

            <div style={{ padding: "30px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", fontSize: "0.85rem" }}>
                <span style={{
                  background: "rgba(99, 102, 241, 0.1)",
                  color: "#818cf8",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontWeight: "600"
                }}>{post.category}</span>
                <span style={{ color: "var(--text-muted)" }}>{post.readTime}</span>
              </div>

              <Link to={`/read/${post.id}`} style={{ textDecoration: 'none' }}>
                <h2 style={{
                  margin: "0 0 12px 0",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  lineHeight: "1.3",
                  color: "var(--text-main)"
                }}
                  onMouseOver={(e) => e.target.style.color = "#818cf8"}
                  onMouseOut={(e) => e.target.style.color = "var(--text-main)"}
                >{post.title}</h2>
              </Link>

              <p style={{ color: "var(--text-muted)", lineHeight: "1.6", marginBottom: "24px" }}>
                {post.excerpt}
              </p>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <img src={post.authorAvatar} alt={post.author} style={{ width: "32px", height: "32px", borderRadius: "50%" }} />
                  <span style={{ fontSize: "0.9rem", fontWeight: "500" }}>{post.author}</span>
                </div>

                <Link to={`/read/${post.id}`} style={{
                  color: "var(--accent)",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  textDecoration: "none"
                }}>Read Article →</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
