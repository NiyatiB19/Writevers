import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LanguageSelector from "../components/LanguageSelector";
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { languageOptions } from '../utils/languageOptions';

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5001";

export default function BlogDetail({ theme, toggleTheme }) {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [likes, setLikes] = useState(0);
    const [translatedContent, setTranslatedContent] = useState(null);
    const [selectedLang, setSelectedLang] = useState("en");
    const [translating, setTranslating] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    // Feature: Follow
    const [isFollowing, setIsFollowing] = useState(false);
    // Feature: Unique Likes
    const [isLiked, setIsLiked] = useState(false);

    // Feature: Replies
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState("");

    const [speechLang, setSpeechLang] = useState("en-US");
    const { speak, pause, resume, stop, isSpeaking, isPaused, hasVoiceForLanguage } = useSpeechSynthesis();
    const navigate = useNavigate();
    const audioRef = React.useRef(null);

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            // Optional: redirect or just allow viewing
        }

        const userStr = localStorage.getItem("user");
        const userId = userStr ? (() => { try { return JSON.parse(userStr)._id; } catch { return null; } })() : null;
        const url = userId ? `${API_BASE}/api/home/posts/${id}?userId=${userId}` : `${API_BASE}/api/home/posts/${id}`;
        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error("Post not found");
                return res.json();
            })
            .then(data => {
                setPost(data);
                setLikes(data.likes ? (Array.isArray(data.likes) ? data.likes.length : data.likes) : 0);

                // Check if current user liked
                const userStr = localStorage.getItem("user");
                if (userStr) {
                    const u = JSON.parse(userStr);
                    if (data.likes && Array.isArray(data.likes) && data.likes.includes(u._id)) {
                        setIsLiked(true);
                    }
                    // Check if following author
                    if (data.authorId && u.following && u.following.includes(data.authorId)) {
                        setIsFollowing(true);
                    }
                }

                setComments(data.commentsData || []);
                setTranslatedContent(null);
                setSelectedLang("en");
            })
            .catch(err => {
                console.error(err);
            });
    }, [id, navigate]);

    const translateBlog = async (lang) => {
        setSelectedLang(lang);
        
        // Stop any ongoing speech
        stop();
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
        }
        
        if (lang === "en") {
            setTranslatedContent(null);
            return;
        }
        if (!post) return;
        setTranslating(true);
        
        const rawHtml = post.content || post.excerpt || "";

        if (!rawHtml.trim()) {
            setTranslating(false);
            return;
        }
        try {
            const response = await fetch(`${API_BASE}/api/translate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text: rawHtml,
                    targetLang: lang
                })
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || data.error || "Translation API returned an error");

            setTranslatedContent(data.translated);

        } catch (error) {
            console.error("Translation error:", error);
            alert("Translation failed");
        }
        setTranslating(false);
    };

    const handleFollow = () => {
        const userStr = localStorage.getItem("user");
        if (!userStr) return navigate("/login");
        const user = JSON.parse(userStr);
        if (!post.authorId) return;

        const wasFollowing = isFollowing;
        setIsFollowing(!wasFollowing);

        fetch(`${API_BASE}/api/home/follow`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ currentUserId: user._id, targetUserId: post.authorId })
        })
            .then(res => res.json())
            .then(data => {
                // Update local storage user following list
                const updatedUser = { ...user, following: data.following };
                localStorage.setItem("user", JSON.stringify(updatedUser));
                setIsFollowing(data.following.includes(post.authorId));
            })
            .catch(err => {
                console.error("Follow failed", err);
                setIsFollowing(wasFollowing);
            });
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
    };

    const handleReport = () => {
        const userStr = localStorage.getItem("user");
        if (!userStr) return navigate("/login");
        const user = JSON.parse(userStr);

        const reason = prompt("Why are you reporting this post?");
        if (!reason) return;

        fetch(`${API_BASE}/api/home/posts/${id}/report`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user._id, reason })
        })
            .then(res => {
                if (res.ok) alert("Post reported to admin.");
                else alert("Failed to report.");
            })
            .catch(err => console.error(err));
    };

    const handleLike = () => {
        const userStr = localStorage.getItem("user");
        if (!userStr) return navigate("/login");
        const user = JSON.parse(userStr);

        // Optimistic
        const wasLiked = isLiked;
        setIsLiked(!wasLiked);
        setLikes(prev => wasLiked ? prev - 1 : prev + 1);

        fetch(`${API_BASE}/api/home/posts/${id}/like`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user._id })
        })
            .then(res => res.json())
            .then(data => {
                setLikes(data.likes);
                setIsLiked(data.isLiked);
            })
            .catch(err => {
                console.error("Like failed", err);
                setIsLiked(wasLiked); // Revert
                setLikes(prev => wasLiked ? prev + 1 : prev - 1);
            });
    };

    const startStopSpeech = async () => {
        if (!post) return;

        if (isSpeaking) {
            if (isPaused) {
                resume();
            } else {
                stop();
                if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
                    audioRef.current = null;
                }
            }
            return;
        }

        // Start speaking
        let textToRead = "";
        if (translatedContent) {
            const div = document.createElement("div");
            div.innerHTML = translatedContent;
            textToRead = div.textContent || div.innerText || "";
        } else {
            const div = document.createElement("div");
            div.innerHTML = post.content || post.excerpt || post.title || '';
            textToRead = div.textContent || div.innerText || "";
        }

        if (!textToRead.trim()) return;

        // Truncate text if it's monstrously huge
        if (textToRead.length > 5000) {
            textToRead = textToRead.substring(0, 5000);
        }

        // Trim and sanitize
        textToRead = textToRead.trim();

        console.log(`Starting speech for language: ${speechLang}`);
        console.log(`Text to speak: ${textToRead.substring(0, 100)}...`);

        try {
            await speak(textToRead, speechLang);
        } catch (error) {
            console.warn("Browser speech failed, using backend TTS:", error);
            // Fallback to backend TTS
            try {
                if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
                }

                const response = await fetch(`${API_BASE}/api/tts`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        text: textToRead,
                        lang: speechLang
                    })
                });

                if (!response.ok) throw new Error("TTS failed");

                const blob = await response.blob();
                const audioUrl = URL.createObjectURL(blob);
                const audio = new Audio(audioUrl);
                audioRef.current = audio;

                audio.onended = () => {
                    URL.revokeObjectURL(audioUrl);
                    audioRef.current = null;
                };
                audio.onerror = () => {
                    URL.revokeObjectURL(audioUrl);
                    audioRef.current = null;
                };

                await audio.play();
            } catch (backendError) {
                console.error("Backend TTS Error:", backendError);
                alert("TTS could not be loaded. Check backend server.");
            }
        }
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
        const tempComment = { ...commentPayload, _id: Date.now().toString(), replies: [], date: new Date() }; // Add replies array
        setComments([...comments, tempComment]);
        setNewComment("");

        fetch(`${API_BASE}/api/home/posts/${id}/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(commentPayload)
        })
            .then(res => res.json())
            .then(savedComment => {
                // Could replace temp comment
            })
            .catch(err => console.error("Comment failed", err));
    };

    const handleReplySubmit = (e, commentId) => {
        e.preventDefault();
        const userStr = localStorage.getItem("user");
        if (!userStr) return navigate("/login");
        const user = JSON.parse(userStr);

        const replyPayload = {
            user: { name: user.name, avatar: user.avatar },
            text: replyText
        };

        fetch(`${API_BASE}/api/home/posts/${id}/comments/${commentId}/reply`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(replyPayload)
        })
            .then(res => res.json())
            .then(newReply => {
                const updatedComments = comments.map(c => {
                    if (c._id === commentId) {
                        return { ...c, replies: [...(c.replies || []), newReply] };
                    }
                    return c;
                });
                setComments(updatedComments);
                setReplyingTo(null);
                setReplyText("");
            })
            .catch(err => console.error("Reply failed", err));
    };


    if (!post) return <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "var(--bg-dark)", color: "var(--text-main)" }}>Loading...</div>;

    return (
        <>
            <Navbar theme={theme} toggleTheme={toggleTheme} />

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

                <div className="container" style={{ maxWidth: "1100px", marginTop: "40px" }}>

                    {/* Author & Meta */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                            <img src={post.authorAvatar} alt={post.author} style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
                            <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <h4 style={{ margin: 0, fontSize: "1.1rem" }}>{post.author}</h4>
                                    {/* Follow Button */}
                                    {(!localStorage.getItem("user") || JSON.parse(localStorage.getItem("user"))._id !== post.authorId) && (
                                        <button
                                            onClick={handleFollow}
                                            style={{
                                                background: isFollowing ? "transparent" : "var(--accent)",
                                                border: isFollowing ? `1px solid var(--border-glass)` : "none",
                                                color: "var(--text-main)",
                                                padding: "4px 12px",
                                                borderRadius: "20px",
                                                fontSize: "0.75rem",
                                                cursor: "pointer",
                                                fontWeight: "600"
                                            }}
                                        >
                                            {isFollowing ? "Following" : "Follow"}
                                        </button>
                                    )}
                                </div>
                                <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.9rem" }}>{new Date(post.createdAt).toLocaleDateString()} · {post.readTime}</p>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                            {/* Share Button */}
                            <button onClick={handleShare} style={{ background: "var(--bg-glass)", border: "var(--border-glass)", color: "var(--text-main)", padding: "8px 16px", borderRadius: "20px", cursor: "pointer", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "6px" }}>
                                🔗 Share
                            </button>

                            {/* Report Button (User Only) */}
                            {localStorage.getItem("user") && JSON.parse(localStorage.getItem("user")).email !== post.authorEmail && (
                                <button onClick={handleReport} style={{ background: "var(--bg-glass)", border: "var(--border-glass)", color: "var(--text-muted)", padding: "8px 16px", borderRadius: "20px", cursor: "pointer", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "6px" }}>
                                    ⚠️ Report
                                </button>
                            )}

                            {/* Delete Button (Only for Author) */}
                            {localStorage.getItem("user") && JSON.parse(localStorage.getItem("user")).email === post.authorEmail && (
                                <button
                                    onClick={() => {
                                        if (window.confirm("Are you sure you want to delete this post?")) {
                                            fetch(`${API_BASE}/api/home/posts/${post._id}`, { method: "DELETE" })
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

                            {/* Listen Section */}
                            <div style={{ display: "flex", gap: "10px", alignItems: "center", background: "var(--bg-glass)", border: "var(--border-glass)", padding: "4px 12px 4px 4px", borderRadius: "30px" }}>
                                <button onClick={startStopSpeech} style={{
                                    background: isSpeaking ? "rgba(34,197,94,0.2)" : "transparent",
                                    border: "none",
                                    color: isSpeaking ? "#4ade80" : "var(--text-main)",
                                    padding: "8px 16px", borderRadius: "20px", cursor: "pointer",
                                    display: "flex", alignItems: "center", gap: "6px", fontWeight: "600", fontSize: "0.9rem", transition: "all 0.2s ease"
                                }}>
                                    <span>{isSpeaking ? '🔊' : '🔈'}</span> {isSpeaking ? (isPaused ? 'Resume' : 'Stop') : 'Listen'}
                                </button>

                                <div style={{ width: "1px", height: "20px", background: "var(--border-glass)" }}></div>

                                <select
                                    value={speechLang}
                                    onChange={(e) => setSpeechLang(e.target.value)}
                                    style={{
                                        background: "transparent",
                                        color: "var(--text-muted)",
                                        border: "none",
                                        padding: "4px",
                                        borderRadius: "4px",
                                        fontSize: "0.80rem",
                                        outline: "none",
                                        cursor: "pointer",
                                        maxWidth: "120px"
                                    }}
                                >
                                    {languageOptions.map(option => (
                                        <option key={option.code} value={option.code} style={{ color: "black" }}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Like Button */}
                            <button onClick={handleLike} style={{
                                background: isLiked ? "rgba(236, 72, 153, 0.2)" : "var(--bg-glass)",
                                border: `1px solid ${isLiked ? "rgba(236, 72, 153, 0.5)" : "var(--border-glass)"}`,
                                color: isLiked ? "#ec4899" : "var(--text-main)", padding: "8px 16px", borderRadius: "20px", cursor: "pointer",
                                display: "flex", alignItems: "center", gap: "6px", fontSize: "0.9rem", transition: "all 0.2s ease"
                            }}>
                                <span>{isLiked ? '❤️' : '🤍'}</span> {likes} {likes === 1 ? 'Like' : 'Likes'}
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="blog-content" style={{ lineHeight: "1.8", fontSize: "1.2rem", color: "var(--text-main)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                            <span style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>Translate:</span>
                            <LanguageSelector value={selectedLang} onLanguageChange={translateBlog} />
                            {translating && <span style={{ color: "var(--accent)", fontSize: "0.85rem" }}>Translating...</span>}
                        </div>
                        {translatedContent !== null ? (
                            <div className="translated-html" dangerouslySetInnerHTML={{ __html: translatedContent }} />
                        ) : (post.content && post.content.includes("<")) ? (
                            <div dangerouslySetInnerHTML={{ __html: post.content }} />
                        ) : (
                            <div style={{ whiteSpace: "pre-line" }}>{post.content || post.excerpt}</div>
                        )}
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
                                    width: "100%", background: "transparent", border: "none", color: "var(--text-main)",
                                    fontSize: "1rem", outline: "none", minHeight: "80px", resize: "none"
                                }}
                            />
                            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
                                <button type="submit" className="btn-primary" style={{ padding: "10px 24px", fontSize: "0.9rem" }}>Post Comment</button>
                            </div>
                        </form>

                        {/* Comment List */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                            {comments.map((comment) => (
                                <div key={comment._id || Math.random()} style={{ display: "flex", gap: "16px" }}>
                                    <img src={comment.user?.avatar || "https://via.placeholder.com/40"} alt={comment.user?.name || "User"} style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} />
                                    <div style={{ width: "100%" }}>
                                        <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "4px" }}>
                                            <h5 style={{ margin: 0, fontSize: "1rem" }}>{comment.user?.name || "Anonymous"}</h5>
                                            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                                                {comment.date ? new Date(comment.date).toLocaleDateString() : ""}
                                            </span>
                                        </div>
                                        <p style={{ margin: "0 0 8px 0", color: "var(--text-main)", lineHeight: "1.5" }}>{comment.text}</p>

                                        {/* Reply Button */}
                                        <button
                                            onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                                            style={{ background: "transparent", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: "0.85rem", padding: 0 }}
                                        >
                                            Reply
                                        </button>

                                        {/* Reply Form */}
                                        {replyingTo === comment._id && (
                                            <form onSubmit={(e) => handleReplySubmit(e, comment._id)} style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                                                <input
                                                    value={replyText}
                                                    onChange={e => setReplyText(e.target.value)}
                                                    placeholder="Write a reply..."
                                                    style={{ flex: 1, padding: "8px", borderRadius: "8px", background: "var(--bg-glass)", border: "none", color: "var(--text-main)" }}
                                                />
                                                <button type="submit" className="btn-primary" style={{ padding: "8px 16px", fontSize: "0.8rem" }}>Send</button>
                                            </form>
                                        )}

                                        {/* Replies List */}
                                        {comment.replies && comment.replies.length > 0 && (
                                            <div style={{ marginTop: "16px", paddingLeft: "20px", borderLeft: "2px solid rgba(255,255,255,0.1)" }}>
                                                {comment.replies.map((reply, rIdx) => (
                                                    <div key={rIdx} style={{ marginBottom: "12px" }}>
                                                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                                                            <strong style={{ fontSize: "0.9rem" }}>{reply.user?.name || "Anonymous"}</strong>
                                                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                                                                {reply.date ? new Date(reply.date).toLocaleDateString() : ""}
                                                            </span>
                                                        </div>
                                                        <p style={{ margin: 0, fontSize: "0.95rem", color: "var(--text-muted)" }}>{reply.text}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
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
