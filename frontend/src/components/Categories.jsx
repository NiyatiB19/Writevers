import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const categoryImages = {
  "Technology": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
  "Design": "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80",
  "Crypto": "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=800&q=80",
  "Investment": "https://images.unsplash.com/photo-1611974765270-ca12586343bb?auto=format&fit=crop&w=800&q=80",
  "Travel": "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80",
  "Food": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
  "Fitness": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
  "Fashion": "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
  "Lifestyle": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
  "Business": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
  "Health": "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=800&q=80"
};

export default function Categories({ categories }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide effect - runs every 3 seconds
  useEffect(() => {
    if (!categories || categories.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % categories.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [categories]);

  if (!categories || categories.length === 0) return null;

  const currentCategory = categories[currentIndex];
  // Fallback image if not in map
  const bgImage = categoryImages[currentCategory.name] || "https://images.unsplash.com/photo-1499750310159-5b5f87ae97e1?auto=format&fit=crop&w=800&q=80";

  return (
    <div id="categories" className="container" style={{ padding: "60px 20px" }}>
      <h3 style={{ fontSize: "1.5rem", marginBottom: "30px", borderLeft: "4px solid var(--accent)", paddingLeft: "12px" }}>Explore Topics</h3>

      <div style={{ position: "relative", width: "100%", height: "300px", borderRadius: "20px", overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>

        {/* Render only current category with transition key */}
        <Link
          key={currentIndex}
          to={`/explore?category=${currentCategory.name}`}
          style={{ textDecoration: 'none', display: 'block', height: '100%', width: '100%', position: 'relative' }}
        >
          <div style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transition: "transform 0.5s ease", // slight zoom verify
          }} className="slide-bg"></div>

          {/* Overlay */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 100%)", // Darker gradient for readability
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "40px",
            alignItems: "center",
            textAlign: "center"
          }}>
            <h2 style={{
              color: "var(--text-main)",
              fontSize: "3rem",
              fontWeight: "800",
              marginBottom: "10px",
              textShadow: "0 4px 10px rgba(0,0,0,0.5)",
              letterSpacing: "2px",
              textTransform: "uppercase"
            }}>
              {currentCategory.name}
            </h2>
            <span style={{
              background: "var(--accent)",
              color: "var(--text-main)",
              padding: "6px 20px",
              borderRadius: "20px",
              fontSize: "1rem",
              fontWeight: "600"
            }}>
              {currentCategory.posts} Articles
            </span>
          </div>
        </Link>

      </div>

      {/* Slider Indicators */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "30px" }}>
        {categories.map((_, idx) => (
          <div key={idx} style={{
            width: idx === currentIndex ? "40px" : "10px",
            height: "6px",
            borderRadius: "4px",
            background: idx === currentIndex ? "var(--accent)" : "rgba(255,255,255,0.2)",
            transition: "all 0.3s ease",
            cursor: "pointer"
          }}
            onClick={() => setCurrentIndex(idx)}
          />
        ))}
      </div>
    </div>
  );
}

