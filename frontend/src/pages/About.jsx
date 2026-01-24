import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function About() {
    return (
        <>
            <Navbar />
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

            </div>
            <Footer />
        </>
    );
}
