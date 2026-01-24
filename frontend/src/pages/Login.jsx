import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogin = (e) => {
        e.preventDefault();
        setError("");

        fetch("http://localhost:5001/api/home/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })
            .then(res => {
                if (!res.ok) throw new Error("Invalid credentials");
                return res.json();
            })
            .then(data => {
                // Store user and token
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                const from = location.state?.from?.pathname || "/";
                navigate(from, { replace: true });
            })
            .catch(err => {
                setError("Invalid email or password");
                console.error(err);
            });
    };

    return (
        <>
            <Navbar />
            <div style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingtop: "80px"
            }}>
                <div className="glass" style={{
                    padding: "40px",
                    borderRadius: "20px",
                    width: "100%",
                    maxWidth: "400px",
                    textAlign: "center"
                }}>
                    <h2 className="text-gradient" style={{ fontSize: "2rem", marginBottom: "30px" }}>Welcome Back</h2>

                    {error && <div style={{ color: "#ef4444", marginBottom: "16px", background: "rgba(239, 68, 68, 0.1)", padding: "8px", borderRadius: "8px" }}>{error}</div>}

                    <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid rgba(255,255,255,0.1)",
                                background: "rgba(0,0,0,0.2)",
                                color: "white",
                                outline: "none"
                            }}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid rgba(255,255,255,0.1)",
                                background: "rgba(0,0,0,0.2)",
                                color: "white",
                                outline: "none"
                            }}
                        />
                        <button type="submit" className="btn-primary" style={{ marginTop: "10px" }}>Login</button>
                    </form>
                    <p style={{ marginTop: "20px", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                        Don't have an account? <Link to="/signup" style={{ color: "var(--accent)", cursor: "pointer", textDecoration: "none" }}>Sign up</Link>
                    </p>
                </div>
            </div>
            <Footer />
        </>
    );
}
