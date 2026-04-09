import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function CookiePolicy({ theme, toggleTheme }) {
  return (
    <>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <div className="container" style={{ paddingTop: "120px", paddingBottom: "80px", minHeight: "80vh", color: "var(--text-main)" }}>
        <h1 className="text-gradient" style={{ fontSize: "3rem", marginBottom: "40px", textAlign: "center" }}>Cookie Policy</h1>
        <div style={{ background: "var(--bg-glass)", border: "var(--border-glass)", padding: "40px", borderRadius: "24px", lineHeight: "1.8", fontSize: "1.1rem", boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}>
          <p>This Cookie policy explains how WriteVerse uses cookies and similar technologies to recognize you when you visit our platform.</p>
          
          <h3 style={{ marginTop: "30px", marginBottom: "15px", color: "var(--accent)" }}>1. What are Cookies?</h3>
          <p>Cookies are small data files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide reporting information.</p>
          
          <h3 style={{ marginTop: "30px", marginBottom: "15px", color: "var(--accent)" }}>2. How we use Cookies</h3>
          <p>We use essential cookies to maintain your login session and preferences (such as your dark/light theme choice). We do not use third-party tracking cookies.</p>

          <h3 style={{ marginTop: "30px", marginBottom: "15px", color: "var(--accent)" }}>3. Managing Cookies</h3>
          <p>You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies.</p>
          
          <p style={{ marginTop: "40px", color: "var(--text-muted)", fontStyle: "italic" }}>Last updated: March 2026</p>
        </div>
      </div>
      <Footer />
    </>
  );
}
