import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function BlogDetail() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [likes, setLikes] = useState(0);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Check auth
        if (!localStorage.getItem("token")) {
            // Redirect logic handled by router usually or here
        }

        fetch(`http://localhost:5001/api/home/posts/${id}`)
            .then(res => {
                if (!res.ok) throw new Error("Post not found");
                return res.json();
            })
            .then(data => {
                setPost(data);
                setLikes(data.likes || 0);
                setComments(data.commentsData || []);
            })
            .catch(err => {
                console.error(err);
            });
    }, [id, navigate]);

    const handleLike = () => {
        // Optimistic update
        setLikes(prev => prev + 1);

        fetch(`http://localhost:5001/api/home/posts/${id}/like`, { method: "POST" })
            .catch(err => console.error("Like failed", err));
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        const userStr = localStorage.getItem("user");
        if (!userStr) return navigate("/login");
        const user = JSON.parse(userStr);

        const commentPayload = {
            user: { name: user.name, avatar: user.avatar },
            text: newComment
        };

        // Optimistic UI
        const tempComment = { ...commentPayload, id: Date.now(), date: "Just now" };
        setComments([...comments, tempComment]);
        setNewComment("");

        fetch(`http://localhost:5001/api/home/posts/${id}/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(commentPayload)
        })
            .then(res => res.json())
            .then(savedComment => {
                // Replace temp with real if needed, or just re-fetch. 
                // For now, keeping optimistic is fine.
            })
            .catch(err => console.error("Comment failed", err));
    };


    if (!post) return <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "var(--bg-dark)", color: "white" }}>Loading...</div>;

    return (
        <>
            <Navbar />

            <article style={{ paddingTop: "100px", minHeight: "100vh", paddingBottom: "80px" }}>
                {/* Header Image */}
                <div style={{
                    height: "50vh",
                    width: "100%",
                    background: `url(${post.image}) center/cover no-repeat`,
                    position: "relative"
                }}>
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 0%, var(--bg-dark) 100%)" }}></div>
                    <div className="container" style={{ position: "absolute", bottom: "40px", left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: "900px" }}>
                        <span style={{
                            padding: "6px 16px", background: "rgba(99, 102, 241, 0.2)", color: "#818cf8",
                            borderRadius: "20px", fontSize: "0.9rem", fontWeight: "600", backdropFilter: "blur(4px)"
                        }}>{post.category}</span>
                        <h1 className="text-gradient" style={{ fontSize: "3.5rem", marginTop: "20px", lineHeight: "1.2" }}>{post.title}</h1>
                    </div>
                </div>

                <div className="container" style={{ maxWidth: "800px", marginTop: "40px" }}>

                    {/* Author & Meta */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                            <img src={post.authorAvatar} alt={post.author} style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
                            <div>
                                <h4 style={{ margin: 0, fontSize: "1.1rem" }}>{post.author}</h4>
                                <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.9rem" }}>{post.createdAt} · {post.readTime}</p>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: "10px" }}>
                            {/* Delete Button (Only for Author) */}
                            {localStorage.getItem("user") && JSON.parse(localStorage.getItem("user")).email === post.authorEmail && (
                                <button
                                    onClick={() => {
                                        if (window.confirm("Are you sure you want to delete this post?")) {
                                            fetch(`http://localhost:5001/api/home/posts/${post.id}`, { method: "DELETE" })
                                                .then(res => {
                                                    if (res.ok) {
                                                        alert("Post deleted successfully");
                                                        navigate("/profile");
                                                    } else {
                                                        alert("Failed to delete post");
                                                    }
                                                })
                                                .catch(err => console.error(err));
                                        }
                                    }}
                                    style={{
                                        background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)",
                                        color: "#ef4444", padding: "10px 20px", borderRadius: "30px", cursor: "pointer",
                                        fontWeight: "600", transition: "all 0.2s ease"
                                    }}
                                >
                                    Delete
                                </button>
                            )}

                            {/* Like Button */}
                            <button onClick={handleLike} style={{
                                background: "rgba(236, 72, 153, 0.1)", border: "1px solid rgba(236, 72, 153, 0.2)",
                                color: "#ec4899", padding: "10px 20px", borderRadius: "30px", cursor: "pointer",
                                display: "flex", alignItems: "center", gap: "8px", fontWeight: "600", transition: "all 0.2s ease"
                            }}>
                                <span>❤️</span> {likes} Likes
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div style={{ lineHeight: "1.8", fontSize: "1.1rem", color: "#e2e8f0", whiteSpace: "pre-line" }}>
                        {post.content || post.excerpt || "No content available for this post."}
                    </div>

                    {/* Comments Section */}
                    <div style={{ marginTop: "80px" }}>
                        <h3 style={{ fontSize: "1.8rem", marginBottom: "30px" }}>Comments ({comments.length})</h3>

                        {/* Comment Form */}
                        <form onSubmit={handleCommentSubmit} className="glass" style={{ padding: "24px", borderRadius: "16px", marginBottom: "40px" }}>
                            <textarea
                                required
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="What are your thoughts?"
                                style={{
                                    width: "100%", background: "transparent", border: "none", color: "white",
                                    fontSize: "1rem", outline: "none", minHeight: "80px", resize: "none"
                                }}
                            />
                            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
                                <button type="submit" className="btn-primary" style={{ padding: "10px 24px", fontSize: "0.9rem" }}>Post Comment</button>
                            </div>
                        </form>

                        {/* Comment List */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                            {comments.map((comment, idx) => (
                                <div key={idx} style={{ display: "flex", gap: "16px" }}>
                                    <img src={comment.user.avatar} alt={comment.user.name} style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} />
                                    <div>
                                        <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "4px" }}>
                                            <h5 style={{ margin: 0, fontSize: "1rem" }}>{comment.user.name}</h5>
                                            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{comment.date}</span>
                                        </div>
                                        <p style={{ margin: 0, color: "var(--text-main)", lineHeight: "1.5" }}>{comment.text}</p>
                                    </div>
                                </div>
                            ))}
                            {comments.length === 0 && <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>No comments yet. Be the first to share your thoughts!</p>}
                        </div>
                    </div>

                </div>
            </article>
            <Footer />
        </>
    );
}
