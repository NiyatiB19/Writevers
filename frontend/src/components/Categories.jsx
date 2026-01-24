import { Link } from "react-router-dom";

export default function Categories({ categories }) {
  if (!categories) return null;

  return (
    <div id="categories" className="container" style={{ padding: "60px 20px" }}>
      <h3 style={{ fontSize: "1.5rem", marginBottom: "30px" }}>Explore Topics</h3>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        gap: "20px"
      }}>
        {categories.map((cat) => (
          <Link key={cat.id} to={`/explore?category=${cat.name}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="glass" style={{
              padding: "24px",
              borderRadius: "16px",
              textAlign: "center",
              cursor: "pointer",
              transition: "transform 0.2s ease",
              position: "relative",
              overflow: "hidden",
              height: "100%"
            }}
              onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
              onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              {/* Gradient Background Orb */}
              <div className={`bg-gradient-to-br ${cat.color}`} style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                opacity: 0.2,
                filter: 'blur(20px)'
              }} />

              <h4 style={{ margin: "0 0 8px 0", fontSize: "1.1rem" }}>{cat.name}</h4>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)" }}>{cat.posts} Posts</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
