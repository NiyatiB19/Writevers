import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { homeApiUrl } from "../utils/api";

export default function AllBlogs({ theme, toggleTheme }) {
    const [posts, setPosts] = useState([]);
    const [searchParams] = useSearchParams();
    const categoryFilter = searchParams.get("category");
    const searchQuery = searchParams.get("search");

    useEffect(() => {
        fetch(homeApiUrl())
            .then(res => res.json())
            .then(data => {
                let allPosts = data.posts;

                if (categoryFilter) {
                    allPosts = allPosts.filter(p => p.category === categoryFilter);
                }

                if (searchQuery) {
                    const query = searchQuery.toLowerCase();
                    allPosts = allPosts.filter(p =>
                        p.title.toLowerCase().includes(query) ||
                        p.author.toLowerCase().includes(query) ||
                        p.category.toLowerCase().includes(query)
                    );
                }

                setPosts(allPosts);
            })
            .catch(err => console.error(err));
    }, [categoryFilter, searchQuery]);

    return (
        <>
            <Navbar theme={theme} toggleTheme={toggleTheme} />
            <div className="container" style={{ paddingTop: "120px", paddingBottom: "60px", minHeight: "100vh" }}>
                <div className="mobile-col" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
                    <h2 style={{ fontSize: "2.5rem" }}>
                        {searchQuery
                            ? `Search Results for "${searchQuery}"`
                            : categoryFilter
                                ? `${categoryFilter} Articles`
                                : "Explore All Articles"}
                    </h2>
                    {(categoryFilter || searchQuery) && (
                        <Link to="/explore" style={{
                            color: "var(--accent)", textDecoration: "none", fontWeight: "600",
                            border: "1px solid var(--accent)", padding: "8px 16px", borderRadius: "20px"
                        }}>Clear Filter ✕</Link>
                    )}
                </div>

                {posts.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px", color: "var(--text-muted)", fontSize: "1.2rem" }}>
                        No articles found for this category.
                    </div>
                ) : (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                        gap: "30px"
                    }}>
                        {posts.map(post => (
                            <div key={post._id} className="glass" style={{
                                borderRadius: "16px",
                                overflow: "hidden",
                                display: "flex",
                                flexDirection: "column",
                                transition: "transform 0.2s"
                            }}
                                onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                                onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
                            >
                                <img
                                    src={post.image || "https://images.unsplash.com/photo-1499750310159-5b5f87ae97e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"}
                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1499750310159-5b5f87ae97e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" }}
                                    alt={post.title}
                                    style={{
                                        height: "200px",
                                        width: "100%",
                                        objectFit: "cover"
                                    }}
                                />
                                <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1 }}>
                                    <span style={{ fontSize: "0.8rem", color: "var(--accent)", fontWeight: "600", marginBottom: "8px" }}>{post.category}</span>
                                    <h3 style={{ margin: "0 0 10px 0", fontSize: "1.2rem", lineHeight: "1.3" }}>{post.title}</h3>
                                    <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", flex: 1 }}>{post.excerpt}</p>

                                    <Link to={`/read/${post._id}`} className="btn-primary" style={{
                                        textDecoration: "none",
                                        display: "inline-block",
                                        textAlign: "center",
                                        marginTop: "20px",
                                        fontSize: "0.9rem",
                                        padding: "8px 20px"
                                    }}>Read Article</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}
