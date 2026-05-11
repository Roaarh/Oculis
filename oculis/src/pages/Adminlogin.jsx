// src/pages/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useTheme } from "../ThemeContext";
import "../styles/Auth.css";
import Enterbutton from "../components/Enterbutton";

export default function AdminLogin() {
  const { theme, THEME_STYLES } = useTheme();
  const currentStyle = THEME_STYLES[theme];
  const navigate = useNavigate();

  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isMuted, setIsMuted] = useState(false);
  const toggleMute = () => setIsMuted((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:4000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: adminEmail, 
          password: adminPassword 
        }),
      });

      const data = await res.json();

      if (data.ok) {
        // Store admin token
        localStorage.setItem("adminToken", data.token);
        navigate("/admin-panel");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please check if backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="auth-root"
      style={{
        background: currentStyle.background,
        color: currentStyle.text,
      }}
    >
      <Navbar
        currentStyle={currentStyle}
        isMuted={isMuted}
        toggleMute={toggleMute}
      />

      <main className="auth-main">
        <div className="auth-card">
          <form className="auth-form" onSubmit={handleSubmit}>
            <h2 className="auth-title">Admin login</h2>
            <p className="auth-subtitle">Sign in to manage Oculis</p>

            {error && (
              <div className="auth-error" style={{ color: "#ef4444", marginBottom: "1rem" }}>
                {error}
              </div>
            )}

            <label className="auth-label">
              Admin email
              <input
                type="email"
                className="auth-input"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@oculis.com"
                required
                disabled={loading}
              />
            </label>

            <label className="auth-label">
              Password
              <input
                type="password"
                className="auth-input"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="password"
                required
                disabled={loading}
              />
            </label>

            <Enterbutton
              type="submit"
              disabled={loading || !adminEmail || !adminPassword}
              className="auth-submit-btn"
            >
              {loading ? "Signing in..." : "Continue"}
            </Enterbutton>
          </form>

        </div>
      </main>
    </div>
  );
}
