import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ForgotPassword({ theme, toggleTheme }) {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        fetch("http://localhost:5001/api/home/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email.trim() }),
        })
            .then(async (res) => {
                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.message || "User not found or error occurred");
                }
                return res.json();
            })
            .then((data) => {
                setMessage("Password reset email sent! Check your inbox.");
            })
            .catch((err) => {
                setError(err.message || "Failed to send reset email");
            });
    };

    return (
        <>
            <Navbar theme={theme} toggleTheme={toggleTheme} />
            <div style={{ minHeight: "80vh", display: "flex", justifyContent: "center", alignItems: "center", paddingTop: "80px" }}>
                <div className="glass" style={{ padding: "40px", borderRadius: "20px", width: "100%", maxWidth: "400px", textAlign: "center" }}>
                    <h2 className="text-gradient" style={{ fontSize: "2rem", marginBottom: "20px" }}>Forgot Password</h2>

                    {message && <div style={{ color: "#22c55e", marginBottom: "16px", background: "rgba(34,197,94,0.1)", padding: "10px", borderRadius: "8px" }}>{message}</div>}
                    {error && <div style={{ color: "#ef4444", marginBottom: "16px", background: "rgba(239, 68, 68, 0.1)", padding: "10px", borderRadius: "8px" }}>{error}</div>}

                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                padding: "12px",
                                borderRadius: "8px",
                                border: "var(--border-glass)",
                                background: "var(--bg-glass)",
                                color: "var(--text-main)",
                                outline: "none"
                            }}
                        />
                        <button type="submit" className="btn-primary">Send Reset Link</button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
}
