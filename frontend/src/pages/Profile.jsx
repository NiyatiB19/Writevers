import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [myPosts, setMyPosts] = useState([]);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editFormData, setEditFormData] = useState({}); // { name, phone, ... }
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setEditFormData({
                name: parsedUser.name || "",
                phone: parsedUser.phone || "",
                address: parsedUser.address || "",
                interests: parsedUser.interests || "",
                hobbies: parsedUser.hobbies || ""
            });

            // Fetch all posts and filter (MVP approach)
            fetch("http://localhost:5001/api/home")
                .then(res => res.json())
                .then(data => {
                    const userPosts = data.posts.filter(p =>
                        p.authorEmail && p.authorEmail.toLowerCase() === parsedUser.email.toLowerCase()
                    );
                    setMyPosts(userPosts);
                })
                .catch(err => console.error(err));

        } else {
            navigate("/login");
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                updateProfileImage(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const updateProfileImage = (newImage) => {
        const updatedUser = { ...user, avatar: newImage };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        fetch("http://localhost:5001/api/home/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: user.id, avatar: newImage })
        }).catch(err => console.error(err));
    };

    const handleEditChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const saveProfileChanges = () => {
        const updatedUser = { ...user, ...editFormData };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser)); // Optimistic local

        fetch("http://localhost:5001/api/home/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: user.id, ...editFormData })
        })
            .then(() => setIsEditingProfile(false))
            .catch(err => console.error(err));
    };

    const inputStyle = {
        width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(0,0,0,0.2)", color: "white", outline: "none"
    };

    if (!user) return <div className="container" style={{ paddingTop: "120px" }}>Loading profile...</div>;

    return (
        <>
            <Navbar />
            <div className="container" style={{ paddingTop: "120px", paddingBottom: "60px", maxWidth: "1000px" }}>

                {/* Profile Card */}
                <div className="glass" style={{ padding: "40px", borderRadius: "24px", display: "flex", flexDirection: "column", gap: "30px", alignItems: "center", marginBottom: "60px", width: "100%" }}>
                    <div style={{ position: "relative", cursor: "pointer" }} onClick={handleImageClick}>
                        <img
                            src={user.avatar}
                            alt={user.name}
                            style={{ width: "150px", height: "150px", borderRadius: "50%", objectFit: "cover", border: "4px solid rgba(255,255,255,0.1)" }}
                        />
                        <div style={{
                            position: "absolute", bottom: "10px", right: "10px",
                            background: "#6366f1", width: "32px", height: "32px", borderRadius: "50%", border: "2px solid #0f172a",
                            display: "flex", justifyContent: "center", alignItems: "center", color: "white", fontSize: "14px"
                        }}>📷</div>
                        <input type="file" ref={fileInputRef} style={{ display: "none" }} accept="image/*" onChange={handleFileChange} />
                    </div>

                    {isEditingProfile ? (
                        <div style={{ width: "100%", maxWidth: "800px" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                                <div>
                                    <label style={{ display: "block", marginBottom: "5px" }}>Name</label>
                                    <input name="name" value={editFormData.name} onChange={handleEditChange} style={inputStyle} />
                                </div>
                                <div>
                                    <label style={{ display: "block", marginBottom: "5px" }}>Phone</label>
                                    <input name="phone" value={editFormData.phone} onChange={handleEditChange} style={inputStyle} />
                                </div>
                                <div style={{ gridColumn: "span 2" }}>
                                    <label style={{ display: "block", marginBottom: "5px" }}>Address</label>
                                    <input name="address" value={editFormData.address} onChange={handleEditChange} style={inputStyle} />
                                </div>
                                <div style={{ gridColumn: "span 2" }}>
                                    <label style={{ display: "block", marginBottom: "5px" }}>Interests</label>
                                    <input name="interests" value={editFormData.interests} onChange={handleEditChange} style={inputStyle} />
                                </div>
                                <div style={{ gridColumn: "span 2" }}>
                                    <label style={{ display: "block", marginBottom: "5px" }}>Hobbies</label>
                                    <input name="hobbies" value={editFormData.hobbies} onChange={handleEditChange} style={inputStyle} />
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                                <button onClick={saveProfileChanges} className="btn-primary" style={{ padding: "8px 24px" }}>Save Changes</button>
                                <button onClick={() => setIsEditingProfile(false)} style={{
                                    padding: "8px 24px", borderRadius: "99px", border: "1px solid rgba(255,255,255,0.2)",
                                    background: "transparent", color: "white", cursor: "pointer"
                                }}>Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div style={{ textAlign: "center" }}>
                                <h2 className="text-gradient" style={{ fontSize: "2.5rem", margin: "0 0 8px 0" }}>{user.name}</h2>
                                <p style={{ margin: 0, color: "var(--text-muted)" }}>Member since 2026</p>
                                <button onClick={() => setIsEditingProfile(true)} style={{
                                    marginTop: "10px", background: "transparent", border: "1px solid rgba(255,255,255,0.2)",
                                    color: "var(--text-muted)", padding: "4px 12px", borderRadius: "20px", cursor: "pointer", fontSize: "0.8rem"
                                }}>Edit Profile</button>
                            </div>

                            <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.1)" }}></div>

                            <div style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", maxWidth: "800px" }}>
                                <div>
                                    <h4 style={{ color: "var(--accent)", marginBottom: "16px" }}>Contact Info</h4>
                                    <p style={{ marginBottom: "8px" }}><strong>Email:</strong> {user.email}</p>
                                    <p style={{ marginBottom: "8px" }}><strong>Phone:</strong> {user.phone}</p>
                                    <p style={{ marginBottom: "8px" }}><strong>Address:</strong> {user.address}</p>
                                </div>
                                <div>
                                    <h4 style={{ color: "var(--secondary)", marginBottom: "16px" }}>Personal</h4>
                                    <p style={{ marginBottom: "8px" }}><strong>Interests:</strong> {user.interests}</p>
                                    <p style={{ marginBottom: "8px" }}><strong>Hobbies:</strong> {user.hobbies}</p>
                                </div>
                            </div>

                            <button onClick={handleLogout} style={{
                                marginTop: "20px", background: "rgba(239, 68, 68, 0.2)", color: "#ef4444",
                                border: "1px solid rgba(239, 68, 68, 0.3)", padding: "10px 24px", borderRadius: "9999px",
                                cursor: "pointer", fontWeight: "600"
                            }}>Logout</button>
                        </>
                    )}
                </div>

                {/* My Blogs Section */}
                <h3 className="text-gradient" style={{ fontSize: "2rem", marginBottom: "30px" }}>My Published Vlogs</h3>

                {myPosts.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                        <p>You haven't published any vlogs yet.</p>
                        <button onClick={() => navigate("/write")} className="btn-primary" style={{ marginTop: "16px" }}>Start Writing</button>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "30px" }}>
                        {myPosts.map(post => (
                            <div key={post.id} className="glass" style={{ borderRadius: "16px", overflow: "hidden", transition: "transform 0.3s ease", position: "relative" }}>
                                <img src={post.image} alt={post.title} style={{ width: "100%", height: "180px", objectFit: "cover" }} />
                                <div style={{ padding: "20px" }}>
                                    <span style={{ fontSize: "0.8rem", color: "var(--accent)", fontWeight: "600" }}>{post.category}</span>
                                    <h4 style={{ margin: "10px 0", fontSize: "1.2rem", lineHeight: "1.4" }}>
                                        <Link to={`/read/${post.id}`} style={{ color: "var(--text-main)", textDecoration: "none" }}>{post.title}</Link>
                                    </h4>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px", fontSize: "0.9rem", color: "var(--text-muted)" }}>
                                        <span>{post.createdAt}</span>
                                        <span>{post.views} views</span>
                                    </div>

                                    {/* Action Buttons */}
                                    <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                                        <button
                                            onClick={() => navigate(`/edit/${post.id}`)}
                                            style={{
                                                flex: 1, padding: "8px", borderRadius: "8px", border: "none",
                                                background: "rgba(99, 102, 241, 0.2)", color: "#818cf8", cursor: "pointer", fontWeight: "600"
                                            }}
                                        >
                                            Edit ✏️
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (window.confirm("Are you sure you want to delete this post?")) {
                                                    fetch(`http://localhost:5001/api/home/posts/${post.id}`, { method: "DELETE" })
                                                        .then(res => {
                                                            if (res.ok) {
                                                                setMyPosts(myPosts.filter(p => p.id !== post.id));
                                                            } else {
                                                                alert("Failed to delete");
                                                            }
                                                        });
                                                }
                                            }}
                                            style={{
                                                flex: 1, padding: "8px", borderRadius: "8px", border: "none",
                                                background: "rgba(239, 68, 68, 0.2)", color: "#ef4444", cursor: "pointer", fontWeight: "600"
                                            }}
                                        >
                                            Delete 🗑️
                                        </button>
                                    </div>
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
