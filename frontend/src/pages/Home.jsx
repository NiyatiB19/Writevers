import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import Feed from "../components/Feed";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5001/api/home")
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
      color: "white",
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
      color: "white"
    }}>
      Loading experience...
    </div>
  );

  return (
    <>
      <Navbar />
      <Hero />
      <Categories categories={data.categories} />

      <div className="container" style={{
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
