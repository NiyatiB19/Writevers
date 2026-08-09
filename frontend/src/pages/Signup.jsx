import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { homeApiUrl } from "../utils/api";

export default function Signup({ theme, toggleTheme }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        interests: "",
        hobbies: ""
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(homeApiUrl("/signup"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...formData, email: formData.email.trim() })
        })
            .then(res => res.json())
            .then(data => {
                if (data.message === "User created successfully") {
                    navigate("/");
                } else {
                    alert(data.message);
                }
            })
            .catch(err => {
                console.error(err);
                alert("Failed to connect to server. Please ensure the backend is running.");
            });
    };

    const inputStyle = {
        padding: "12px",
        borderRadius: "8px",
        border: "var(--border-glass)",
        background: "var(--bg-glass)",
        color: "var(--text-main)",
        outline: "none",
        width: "100%"
    };

    return (
        <>
            <Navbar theme={theme} toggleTheme={toggleTheme} />
            <div style={{
                minHeight: "100vh",
                paddingTop: "120px",
                paddingBottom: "60px",
                backgroundImage: "url('/bg.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <div className="container" style={{ maxWidth: "600px", margin: 0 }}>
                <div className="glass" style={{ padding: "40px", borderRadius: "20px" }}>
                    <h2 className="text-gradient" style={{ fontSize: "2rem", marginBottom: "30px", textAlign: "center" }}>Create Account</h2>

                    <form onSubmit={handleSubmit} style={{ display: "grid", gap: "20px" }}>
                        <input name="name" placeholder="Full Name" required value={formData.name} onChange={handleChange} style={inputStyle} />
                        <input name="email" type="email" placeholder="Email Address" required value={formData.email} onChange={handleChange} style={inputStyle} />
                        <input name="password" type="password" placeholder="Password" required value={formData.password} onChange={handleChange} style={inputStyle} />
                        <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} style={inputStyle} />
                        <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} style={inputStyle} />
                        <input name="interests" placeholder="Interests (e.g. Tech, Travel)" value={formData.interests} onChange={handleChange} style={inputStyle} />
                        <input name="hobbies" placeholder="Hobbies" value={formData.hobbies} onChange={handleChange} style={inputStyle} />

                        <button type="submit" className="btn-primary" style={{ marginTop: "10px" }}>Sign Up</button>
                    </form>
                </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
