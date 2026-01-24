import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Signup() {
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
        fetch("http://localhost:5001/api/home/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        })
            .then(res => res.json())
            .then(data => {
                if (data.message === "User created successfully") {
                    alert("Account created! Please login.");
                    navigate("/login");
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
        border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(0,0,0,0.2)",
        color: "white",
        outline: "none",
        width: "100%"
    };

    return (
        <>
            <Navbar />
            <div className="container" style={{ paddingTop: "120px", paddingBottom: "60px", maxWidth: "600px" }}>
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
            <Footer />
        </>
    );
}
