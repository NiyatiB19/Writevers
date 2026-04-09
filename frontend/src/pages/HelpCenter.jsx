import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function HelpCenter({ theme, toggleTheme }) {
  return (
    <>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <div className="container" style={{ paddingTop: "120px", paddingBottom: "80px", minHeight: "80vh", color: "var(--text-main)" }}>
        <h1 className="text-gradient" style={{ fontSize: "3rem", marginBottom: "40px", textAlign: "center" }}>Help Center</h1>
        <div style={{ background: "var(--bg-glass)", border: "var(--border-glass)", padding: "40px", borderRadius: "24px", lineHeight: "1.8", fontSize: "1.1rem", boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}>
          <p>Need assistance? You've come to the right place. Find answers to frequently asked questions below.</p>
          
          <div style={{ marginTop: "30px" }}>
            <h4 style={{ color: "var(--accent)", marginBottom: "10px" }}>How do I publish an article?</h4>
            <p style={{ marginBottom: "20px" }}>Navigate to the "Start Writing" section via the navigation bar. You can use our rich text editor to format your article and publish it instantly.</p>

            <h4 style={{ color: "var(--accent)", marginBottom: "10px" }}>How do I change my profile picture?</h4>
            <p style={{ marginBottom: "20px" }}>Go to your Profile page, click on your avatar, and enter a new image URL.</p>

            <h4 style={{ color: "var(--accent)", marginBottom: "10px" }}>Is the Read Aloud feature free?</h4>
            <p style={{ marginBottom: "20px" }}>Yes! The Text-to-Speech (Listen) feature uses deep integration with browser voice technologies and is completely free for all users.</p>

            <h4 style={{ color: "var(--accent)", marginBottom: "10px" }}>Who can I contact for more help?</h4>
            <p style={{ marginBottom: "20px" }}>Please send an email to <strong>support@writeverse.com</strong> and our team will get back to you within 24 hours.</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
