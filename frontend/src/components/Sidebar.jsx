import React from "react";

export default function Sidebar({ trending, writers }) {
  if (!trending && !writers) return null;

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
        <h4 style={{ margin: "0 0 20px 0", fontSize: "1.1rem" }}>Trending Now 📈</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {trending && trending.map((item, index) => (
            <div key={index} style={{ display: "flex", gap: "12px", alignItems: "baseline" }}>
              <span style={{ fontSize: "1.5rem", fontWeight: "800", color: "rgba(255,255,255,0.1)", lineHeight: 1 }}>0{index + 1}</span>
              <div>
                <p style={{ margin: "0 0 4px 0", fontWeight: "500", fontSize: "0.95rem", cursor: "pointer", transition: "color 0.2s" }}
                  onMouseOver={(e) => e.target.style.color = "#818cf8"}
                  onMouseOut={(e) => e.target.style.color = "var(--text-main)"}
                >{item.title}</p>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{item.views} reads</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Writers Section */}
      <div className="glass" style={{ padding: "24px", borderRadius: "20px" }}>
        <h4 style={{ margin: "0 0 20px 0", fontSize: "1.1rem" }}>Writers to Follow</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {writers && writers.map((writer, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <img src={writer.avatar} alt={writer.name} style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} />
                <div>
                  <p style={{ margin: 0, fontWeight: "600", fontSize: "0.9rem" }}>{writer.name}</p>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-muted)" }}>{writer.followers} followers</p>
                </div>
              </div>
              <button style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "var(--text-main)",
                borderRadius: "20px",
                padding: "6px 14px",
                fontSize: "0.75rem",
                cursor: "pointer"
              }}>Follow</button>
            </div>
          ))}
        </div>
      </div>

    </aside>
  );
}
