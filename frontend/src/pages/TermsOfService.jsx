import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function TermsOfService({ theme, toggleTheme }) {
  return (
    <>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <div className="container" style={{ paddingTop: "120px", paddingBottom: "80px", minHeight: "80vh", color: "var(--text-main)" }}>
        <h1 className="text-gradient" style={{ fontSize: "3rem", marginBottom: "40px", textAlign: "center" }}>Terms of Service</h1>
        <div style={{ background: "var(--bg-glass)", border: "var(--border-glass)", padding: "40px", borderRadius: "24px", lineHeight: "1.8", fontSize: "1.1rem", boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}>
          <p>By accessing and using WriteVerse, you accept and agree to be bound by the terms and provision of this agreement.</p>
          
          <h3 style={{ marginTop: "30px", marginBottom: "15px", color: "var(--accent)" }}>1. User Conduct</h3>
          <p>You agree to use the platform only for lawful purposes. You are strictly prohibited from posting offensive, infringing, or malicious content. WriteVerse reserves the right to terminate accounts that violate community guidelines without notice.</p>
          
          <h3 style={{ marginTop: "30px", marginBottom: "15px", color: "var(--accent)" }}>2. Content Ownership</h3>
          <p>You retain full ownership of the original content you publish on WriteVerse. By posting on WriteVerse, you grant us a non-exclusive, worldwide, royalty-free license to display and distribute your content across the platform.</p>

          <h3 style={{ marginTop: "30px", marginBottom: "15px", color: "var(--accent)" }}>3. Limitation of Liability</h3>
          <p>WriteVerse is provided "as is" without warranty of any kind. We shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use the service.</p>
          
          <p style={{ marginTop: "40px", color: "var(--text-muted)", fontStyle: "italic" }}>Last updated: March 2026</p>
        </div>
      </div>
      <Footer />
    </>
  );
}
