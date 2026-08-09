import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { homeApiUrl } from "../utils/api";

export default function ResetPassword({ theme, toggleTheme }) {
    const { token } = useParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        fetch(homeApiUrl("/reset-password"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, newPassword }),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Invalid or expired token");
                return res.json();
            })
            .then((data) => {
                setMessage("Password reset successful! Redirecting...");
                setTimeout(() => navigate("/login"), 3000);
            })
            .catch((err) => {
                setError(err.message || "Failed to reset password");
            });
    };

    return (
        <>
            <Navbar theme={theme} toggleTheme={toggleTheme} />
            <div style={{ minHeight: "80vh", display: "flex", justifyContent: "center", alignItems: "center", paddingTop: "80px" }}>
                <div className="glass" style={{ padding: "40px", borderRadius: "20px", width: "100%", maxWidth: "400px", textAlign: "center" }}>
                    <h2 className="text-gradient" style={{ fontSize: "2rem", marginBottom: "20px" }}>Reset Password</h2>

                    {message && <div style={{ color: "#22c55e", marginBottom: "16px", background: "rgba(34,197,94,0.1)", padding: "10px", borderRadius: "8px" }}>{message}</div>}
                    {error && <div style={{ color: "#ef4444", marginBottom: "16px", background: "rgba(239, 68, 68, 0.1)", padding: "10px", borderRadius: "8px" }}>{error}</div>}

                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
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
                        <button type="submit" className="btn-primary">Reset Password</button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
}
