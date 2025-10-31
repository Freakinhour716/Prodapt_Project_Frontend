import React from "react";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-page">
      {/* 🔥 Title & Subtitle */}
      <div className="hero-section">
        <h1 className="title">License Tracker</h1>
        <p className="subtitle">
          Keep your <span className="highlight">Assets</span> Secure. Manage{" "}
          <span className="highlight">Licenses</span> with Precision.
        </p>
      </div>

      {/* 🔻 Background GIF */}
      <div className="gif-grid single">
        <div
          className="gif-item"
          style={{
            backgroundImage:
              "url('https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExajl3dGc3NG5qdDkyMjI0M2pvdjdnNmU5NnViaTA4cTVzYjB1cXV4aiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3ohhwJlKHGchQUtvBS/giphy.gif')",
          }}
        ></div>
      </div>

      {/* 💠 About Section */}
      <section className="about-section">
        <h2>About <span className="highlight">License Tracker</span></h2>
        <p>
          A cutting-edge platform built to simplify license management across
          your organization. Gain full visibility, automate renewals, and
          prevent costly expirations — all in one intuitive dashboard.
        </p>
      </section>

      {/* 🧩 Services Section */}
      <section className="services-section">
        <h2 className="section-title">Our <span className="highlight">Services</span></h2>
        <div className="services-grid">
          <div className="service-card">
            <h3>Real-time Monitoring</h3>
            <p>Track active licenses, detect upcoming expirations, and ensure compliance 24/7.</p>
          </div>
          <div className="service-card">
            <h3>Smart Analytics</h3>
            <p>Gain insights into license usage patterns with AI-powered visualization tools.</p>
          </div>
          <div className="service-card">
            <h3>Centralized Control</h3>
            <p>Manage devices, vendors, and license keys — all from one sleek interface.</p>
          </div>
        </div>
      </section>

      {/* 🌈 Footer */}
      <footer className="footer">
        <p>
          © 2025 <span className="highlight">License Tracker</span> — Built for
          Control, Clarity, and Confidence.
        </p>
      </footer>
    </div>
  );
}
