// src/pages/AdminSystem.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useTheme } from "../ThemeContext";
import ThemeSelector from "../components/ThemeSelector";
import "../styles/AdminSystem.css";

export default function AdminSystem() {
  const { theme, THEME_STYLES } = useTheme();
  const currentStyle = THEME_STYLES[theme];
  const navigate = useNavigate();

  const [enableSoundByDefault, setEnableSoundByDefault] = useState(true);
  const [allowRegistrations, setAllowRegistrations] = useState(true);
  const [defaultLanguage, setDefaultLanguage] = useState("en");

  const handleResetPrefs = () => {
    localStorage.removeItem("theme");
    localStorage.removeItem("username");
    localStorage.removeItem("language");
    // later: also clear other keys or call backend
    alert("Local user preferences have been reset.");
  };

  return (
    <div
      className="admin-root"
      style={{
        background: currentStyle.background,
        color: currentStyle.text,
      }}
    >
      

      <main className="admin-system-main">
        {/* Back + header */}
        <div className="admin-system-top">
          <button
            type="button"
            className="admin-back-dashboard-btn"
            onClick={() => navigate("/admin-panel")}
          >
            ← Back to dashboard
          </button>

          <div className="admin-system-header">
            <h1 className="admin-system-title">System edit</h1>
            <p className="admin-system-subtitle">
              Manage themes and global behavior of Oculis
            </p>
          </div>
        </div>

        <div className="admin-system-grid">
          {/* Theme control card */}
          <section className="admin-system-card">
            <h2 className="admin-system-card-title">Theme</h2>
            <p className="admin-system-card-text">
              Choose how Oculis looks for users.
            </p>

            <div className="admin-system-theme-row">
              <div className="admin-system-theme-info">
                <span className="admin-system-label">Current theme</span>
                <span className="admin-system-theme-name">{theme}</span>
              </div>

              <div className="admin-system-theme-preview">
                <span
                  className="admin-system-color-dot"
                  style={{ background: currentStyle.background }}
                />
                <span
                  className="admin-system-color-dot"
                  style={{ background: currentStyle.accent1 }}
                />
                <span
                  className="admin-system-color-dot"
                  style={{ background: currentStyle.accent2 }}
                />
              </div>
            </div>

            <div className="admin-system-theme-selector">
              <ThemeSelector />
            </div>
          </section>

          {/* Global settings card */}
          <section className="admin-system-card">
            <h2 className="admin-system-card-title">Global settings</h2>
            <p className="admin-system-card-text">
              Control system-wide behavior for all users.
            </p>

            <div className="admin-system-toggle-row">
              <div>
                <span className="admin-system-label">Enable sound by default</span>
                <p className="admin-system-description">
                  Play ambient sound when users open Oculis (if not muted).
                </p>
              </div>
              <label className="admin-switch">
                <input
                  type="checkbox"
                  checked={enableSoundByDefault}
                  onChange={(e) => setEnableSoundByDefault(e.target.checked)}
                />
                <span className="admin-switch-slider" />
              </label>
            </div>

            <div className="admin-system-toggle-row">
              <div>
                <span className="admin-system-label">Allow new registrations</span>
                <p className="admin-system-description">
                  Control whether new users can sign up.
                </p>
              </div>
              <label className="admin-switch">
                <input
                  type="checkbox"
                  checked={allowRegistrations}
                  onChange={(e) => setAllowRegistrations(e.target.checked)}
                />
                <span className="admin-switch-slider" />
              </label>
            </div>

            <div className="admin-system-field-row">
              <div>
                <span className="admin-system-label">Default language</span>
                <p className="admin-system-description">
                  Language used when a new user visits Oculis.
                </p>
              </div>
              <select
                className="admin-system-select"
                value={defaultLanguage}
                onChange={(e) => setDefaultLanguage(e.target.value)}
              >
                <option value="en">English</option>
                <option value="ar">Arabic</option>
                <option value="fr">French</option>
                <option value="ch">Chinese</option>
              </select>
            </div>
          </section>

          {/* Danger zone card */}
          <section className="admin-system-card admin-system-danger">
            <h2 className="admin-system-card-title">Danger zone</h2>
            <p className="admin-system-card-text">
              These actions affect saved preferences. Use with care.
            </p>

            <button
              type="button"
              className="admin-system-reset-btn"
              onClick={handleResetPrefs}
            >
              Reset local user preferences
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}
