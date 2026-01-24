import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function CreateBlog() {
    const [formData, setFormData] = useState({
        title: "",
        subtitle: "",
        image: "",
        content: "",
        category: "Technology"
    });

    const categories = ["Technology", "Business", "Food", "Travel", "Lifestyle", "Health"];
    const navigate = useNavigate();
    const { id } = useParams(); // Check if editing
    const isEditing = !!id;

    React.useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please login.");
            navigate("/login");
            return;
        }

        // If editing, fetch existing data
        if (isEditing) {
            fetch(`http://localhost:5001/api/home/posts/${id}`)
                .then(res => res.json())
                .then(data => {
                    setFormData({
                        title: data.title,
                        subtitle: data.excerpt, // map excerpt to subtitle
                        image: data.image,
                        content: data.content,
                        category: data.category || "Technology"
                    });
                })
                .catch(err => console.error(err));
        }
    }, [navigate, id, isEditing]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const userStr = localStorage.getItem("user");
        let extraData = {};

        if (userStr) {
            const user = JSON.parse(userStr);
            extraData = {
                authorName: user.name,
                authorEmail: user.email,
                authorAvatar: user.avatar
            };
        }

        const url = isEditing
            ? `http://localhost:5001/api/home/posts/${id}`
            : "http://localhost:5001/api/home/posts";

        const method = isEditing ? "PUT" : "POST";

        fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...formData, ...extraData })
        })
            .then(res => {
                if (res.ok) {
                    navigate("/profile"); // Go to profile to see changes
                } else {
                    alert("Failed to save post");
                }
            })
            .catch(err => console.error(err));
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const inputStyle = {
        padding: "16px",
        borderRadius: "12px",
        border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(0,0,0,0.2)",
        color: "white",
        outline: "none",
        width: "100%",
        fontSize: "1rem"
    };

    return (
        <>
            <Navbar />
            <div className="container" style={{ paddingTop: "120px", paddingBottom: "60px", maxWidth: "800px" }}>
                <h2 className="text-gradient" style={{ fontSize: "2.5rem", marginBottom: "40px", textAlign: "center" }}>
                    {isEditing ? "Edit Your Story" : "Start Writing"}
                </h2>

                <form onSubmit={handleSubmit} className="glass" style={{ padding: "40px", borderRadius: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>

                    <div>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Title</label>
                        <input name="title" required placeholder="Enter an engaging title..." value={formData.title} onChange={handleChange} style={inputStyle} />
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Subtitle</label>
                        <input name="subtitle" required placeholder="A short description..." value={formData.subtitle} onChange={handleChange} style={inputStyle} />
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Category</label>
                        <select name="category" value={formData.category} onChange={handleChange} style={inputStyle}>
                            {categories.map(cat => (
                                <option key={cat} value={cat} style={{ color: "black" }}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Cover Image URL</label>
                        <input name="image" placeholder="https://example.com/image.jpg" value={formData.image} onChange={handleChange} style={inputStyle} />
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Content</label>
                        <textarea name="content" required placeholder="Tell your story..." value={formData.content} onChange={handleChange} style={{ ...inputStyle, minHeight: "300px", fontFamily: "inherit" }} />
                    </div>

                    <button type="submit" className="btn-primary" style={{ fontSize: "1.1rem", padding: "16px" }}>Publish Story</button>

                </form>
            </div>
            <Footer />
        </>
    );
}
