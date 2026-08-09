import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import Feed from "../components/Feed";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { homeApiUrl } from "../utils/api";

export default function Home({ theme, toggleTheme }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    let url = homeApiUrl();
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user._id) {
          url += `?userId=${user._id}`;
        }
      } catch (e) {
        console.error("Error parsing user", e);
      }
    }

    fetch(url)
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => {
        console.error("Failed to fetch data:", err);
        setError(true);
      });
  }, []);

  if (error) return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "var(--bg-dark)",
      color: "var(--text-main)",
      textAlign: "center"
    }}>
      <h2 style={{ marginBottom: "20px" }}>⚠️ Offline</h2>
      <p>The backend server is not running.</p>
      <p>Please run <code>npm start</code> in your backend terminal.</p>
    </div>
  );

  if (!data) return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "var(--bg-dark)",
      color: "var(--text-main)"
    }}>
      Loading experience...
    </div>
  );

  return (
    <>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <Hero />
      <Categories categories={data.categories} />

      <div className="container mobile-col" style={{ display: "flex", gap: "40px", marginBottom: "30px", alignItems: "center" }}>
        <div style={{ flex: "1", minWidth: "0" }}>
          <h3 style={{ fontSize: "1.5rem", margin: 0 }}>Latest Read</h3>
        </div>
        <div style={{ flex: "0 0 350px" }}>
          <h4 style={{ fontSize: "1.5rem", margin: 0 }}>Trending Stories</h4>
        </div>
      </div>

      <div className="container mobile-col" style={{
        display: "flex",
        gap: "40px",
        paddingBottom: "60px",
        alignItems: "flex-start", // Important for sticky sidebar
        flexWrap: "wrap"
      }}>
        <div style={{ flex: "1", minWidth: "0" }}> {/* minWidth 0 prevents flex child from overflowing */}
          <Feed posts={data.posts} />
        </div>
        <Sidebar trending={data.trending} writers={data.writers} />
      </div>

      <Footer />
    </>
  );
}
