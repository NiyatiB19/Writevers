import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PrivacyPolicy({ theme, toggleTheme }) {
  return (
    <>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <div className="container" style={{ paddingTop: "120px", paddingBottom: "80px", minHeight: "80vh", color: "var(--text-main)" }}>
        <h1 className="text-gradient" style={{ fontSize: "3rem", marginBottom: "40px", textAlign: "center" }}>Privacy Policy</h1>
        <div style={{ background: "var(--bg-glass)", border: "var(--border-glass)", padding: "40px", borderRadius: "24px", lineHeight: "1.8", fontSize: "1.1rem", boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}>
          <p>Welcome to WriteVerse. Your privacy is critically important to us. This Privacy Policy outlines the types of information we gather when you use our services, how we use it, and the choices you have regarding your information.</p>
          
          <h3 style={{ marginTop: "30px", marginBottom: "15px", color: "var(--accent)" }}>1. Information We Collect</h3>
          <p>We only collect the information you choose to give us, and we process it with your consent or on another legal basis; we only require the minimum amount of personal information necessary to fulfill the purpose of your interaction with us.</p>
          <ul style={{ marginLeft: "20px", marginTop: "10px" }}>
            <li><strong>Account details:</strong> Name, email address, and profile data you choose to provide.</li>
            <li><strong>Content:</strong> Blogs, comments, and interactions you make on the platform.</li>
          </ul>

          <h3 style={{ marginTop: "30px", marginBottom: "15px", color: "var(--accent)" }}>2. How We Use Information</h3>
          <p>We use your information to provide, maintain, and improve our services, including formatting your articles, suggesting content tailored to your interests, and facilitating community interactions.</p>

          <h3 style={{ marginTop: "30px", marginBottom: "15px", color: "var(--accent)" }}>3. Data Security</h3>
          <p>We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. We use secure socket layer technology (SSL) and strong hashing algorithms to guard your data.</p>
          
          <p style={{ marginTop: "40px", color: "var(--text-muted)", fontStyle: "italic" }}>Last updated: March 2026</p>
        </div>
      </div>
      <Footer />
    </>
  );
}
