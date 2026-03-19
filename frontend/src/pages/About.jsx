import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5001/api/home";

export default function About({ theme, toggleTheme }) {
    const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleContactSubmit = (e) => {
        e.preventDefault();
        setSending(true);
        fetch(`${API_BASE}/contact`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(contactForm)
        })
            .then(res => res.json())
            .then(data => {
                setSending(false);
                if (data.id || data.message) {
                    setSent(true);
                    setContactForm({ name: "", email: "", subject: "", message: "" });
                } else {
                    alert(data.message || "Failed to send.");
                }
            })
            .catch(() => {
                setSending(false);
                alert("Failed to send message.");
            });
    };

    return (
        <>
            <Navbar theme={theme} toggleTheme={toggleTheme} />
            <div className="container" style={{ paddingTop: "120px", paddingBottom: "60px", maxWidth: "800px" }}>

                <div style={{ textAlign: "center", marginBottom: "60px" }}>
                    <span style={{
                        padding: "6px 16px",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "30px",
                        color: "#c084fc",
                        fontSize: "0.9rem",
                        fontWeight: "500"
                    }}>Our Mission</span>
                    <h1 className="text-gradient" style={{ fontSize: "3rem", margin: "20px 0" }}>Empowering Voices Everywhere</h1>
                    <p style={{ fontSize: "1.2rem", color: "var(--text-muted)", lineHeight: "1.6" }}>
                        WriteVerse is a next-generation publishing platform designed for the storytellers of tomorrow.
                        We believe that great ideas deserve a beautiful home.
                    </p>
                </div>

                <div className="glass" style={{ padding: "40px", borderRadius: "24px" }}>
                    <h3 style={{ fontSize: "1.8rem", marginBottom: "20px" }}>Why WriteVerse?</h3>
                    <p style={{ lineHeight: "1.8", color: "var(--text-main)", marginBottom: "20px" }}>
                        In a digital world cluttered with noise, we wanted to build a sanctuary for thoughtful writing.
                        Whether you're sharing personal anecdotes, technical tutorials, or fictional worlds, WriteVerse provides
                        the canvas you need to express yourself fully.
                    </p>
                    <p style={{ lineHeight: "1.8", color: "var(--text-main)" }}>
                        Our platform is built on modern web technologies to ensure speed, accessibility, and a premium reading experience
                        across all devices. Join us on this journey to redefine digital publishing.
                    </p>
                </div>

                <div className="glass" style={{ padding: "40px", borderRadius: "24px", marginTop: "60px" }}>
                    <h3 style={{ fontSize: "2rem", marginBottom: "30px", textAlign: "center" }}>Get in Touch</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
                        <div>
                            <h4 style={{ fontSize: "1.2rem", marginBottom: "16px" }}>Contact Information</h4>
                            <p style={{ color: "var(--text-muted)", marginBottom: "8px" }}>Have questions? We'd love to hear from you.</p>
                            <ul style={{ listStyle: "none", padding: 0, marginTop: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                                <li style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                    <span style={{ width: "32px", height: "32px", background: "rgba(99, 102, 241, 0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#818cf8" }}>📧</span>
                                    <span>hello@writeverse.com</span>
                                </li>
                                <li style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                    <span style={{ width: "32px", height: "32px", background: "rgba(99, 102, 241, 0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#818cf8" }}>📱</span>
                                    <span>+1 (555) 123-4567</span>
                                </li>
                                <li style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                    <span style={{ width: "32px", height: "32px", background: "rgba(99, 102, 241, 0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#818cf8" }}>📍</span>
                                    <span>123 Creative Ave, Innovation City</span>
                                </li>
                            </ul>
                        </div>
                        <form onSubmit={handleContactSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            {sent && (
                                <p style={{ color: "var(--accent)", margin: 0, fontSize: "0.95rem" }}>Message sent! We'll get back to you shortly.</p>
                            )}
                            <div style={{ display: "flex", gap: "16px" }}>
                                <input required placeholder="Name" value={contactForm.name} onChange={e => setContactForm({ ...contactForm, name: e.target.value })} style={{ flex: 1, padding: "12px", borderRadius: "8px", background: "var(--bg-glass)", border: "var(--border-glass)", color: "var(--text-main)", outline: "none" }} />
                                <input required type="email" placeholder="Email" value={contactForm.email} onChange={e => setContactForm({ ...contactForm, email: e.target.value })} style={{ flex: 1, padding: "12px", borderRadius: "8px", background: "var(--bg-glass)", border: "var(--border-glass)", color: "var(--text-main)", outline: "none" }} />
                            </div>
                            <input required placeholder="Subject" value={contactForm.subject} onChange={e => setContactForm({ ...contactForm, subject: e.target.value })} style={{ padding: "12px", borderRadius: "8px", background: "var(--bg-glass)", border: "var(--border-glass)", color: "var(--text-main)", outline: "none" }} />
                            <textarea required placeholder="Your Message" value={contactForm.message} onChange={e => setContactForm({ ...contactForm, message: e.target.value })} style={{ padding: "12px", borderRadius: "8px", background: "var(--bg-glass)", border: "var(--border-glass)", color: "var(--text-main)", outline: "none", minHeight: "120px", resize: "vertical" }} />
                            <button type="submit" disabled={sending} className="btn-primary" style={{ padding: "12px", borderRadius: "8px", fontWeight: "600", marginTop: "8px" }}>{sending ? "Sending..." : "Send Message"}</button>
                        </form>
                    </div>
                </div>

            </div>
            <Footer />
        </>
    );
}
