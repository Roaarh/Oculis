import React, { useState, useEffect } from "react";
import { useTheme } from "../ThemeContext";
import "../styles/Settings.css";
import ThemeSelector from "../components/ThemeSelector";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const { theme, THEME_STYLES, setTheme } = useTheme();
  const navigate = useNavigate();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load current theme from database on mount
  useEffect(() => {
    const userId = localStorage.getItem("oculis_user_id");
    console.log("🔍 Settings useEffect - userId:", userId);

    if (!userId) {
      setLoading(false);
      return;
    }

    async function fetchSettings() {
      try {
        console.log("📡 Fetching settings for userId:", userId);
        const res = await fetch(
          `http://localhost:4000/api/user/settings?userId=${userId}`
        );
        const data = await res.json();
        console.log("📦 Settings API Response:", { status: res.status, data });

        if (res.ok && data.ok && data.settings) {
          let savedTheme = data.settings.theme;
          console.log("📌 Saved theme from DB:", savedTheme);
          
          // If we have a saved theme and it exists in THEME_STYLES, use it
          if (savedTheme && THEME_STYLES[savedTheme]) {
            console.log("✅ Using saved theme:", savedTheme);
            setTheme(savedTheme);
          } else {
            console.log("⚠️ Saved theme not valid, using current theme:", theme);
            // Just keep the current theme from context
          }
        }
      } catch (err) {
        console.error("🔴 Failed to load settings", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  // Save theme to database when it changes
  const handleThemeChange = async (newTheme) => {
    const userId = localStorage.getItem("oculis_user_id");
    console.log("🎨 Theme changed to:", newTheme, "userId:", userId);

    if (!userId) {
      console.warn("⚠️ No userId, cannot save theme");
      return;
    }

    setTheme(newTheme);
    setSaving(true);

    try {
      console.log("📤 Saving theme:", newTheme);
      const res = await fetch("http://localhost:4000/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          theme: newTheme,
        }),
      });

      const data = await res.json();
      console.log("📥 Theme save response:", { status: res.status, data });

      if (!res.ok || !data.ok) {
        console.error("❌ Failed to save theme", data.error);
      } else {
        console.log("✅ Theme saved successfully");
      }
    } catch (err) {
      console.error("🔴 Failed to save theme", err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    console.log("🚪 Logging out");
    localStorage.clear();
    navigate("/auth");
  };

  const handleDeleteAccount = async () => {
    const userId = localStorage.getItem("oculis_user_id");
    console.log("🗑️ Deleting account, userId:", userId);

    if (!userId) {
      console.warn("⚠️ No userId, cannot delete account");
      return;
    }

    try {
      console.log("📤 Sending delete account request");
      const res = await fetch("http://localhost:4000/api/user/account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
        }),
      });

      const data = await res.json();
      console.log("📥 Delete response:", { status: res.status, data });

      if (!res.ok || !data.ok) {
        console.error("❌ Failed to delete account", data.error);
        return;
      }

      console.log("✅ Account deleted successfully");
      localStorage.clear();
      navigate("/");
    } catch (err) {
      console.error("🔴 Failed to delete account", err);
    }
  };

  // Safe access to current theme style
  const currentStyle = THEME_STYLES && THEME_STYLES[theme]
    ? THEME_STYLES[theme]
    : { background: "#0a0f1f", text: "#fff" }; // fallback style

  return (
    <div
      className="settings-root"
      style={{
        background: currentStyle.background,
        color: currentStyle.text,
      }}
    >
      <main className="settings-main">
        <button
          type="button"
          className="settings-back-btn"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <div className="settings-card-minimal glass-white">
          <h1 className="settings-title-minimal">Settings</h1>

          {loading ? (
            <p>Loading settings...</p>
          ) : (
            <>
              {/* Theme inside the card */}
              <section className="settings-section-minimal">
                <div className="settings-label-minimal">Theme</div>
                <div
                  style={{
                    opacity: saving ? 0.6 : 1,
                    transition: "opacity 0.2s",
                  }}
                >
                  <ThemeSelector onThemeChange={handleThemeChange} />
                </div>
              </section>

              {/* Actions inside the same card */}
              <div className="settings-actions-minimal">
                {!showDeleteConfirm ? (
                  <button
                    type="button"
                    className="settings-delete-minimal-soft"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Delete account…
                  </button>
                ) : (
                  <button
                    type="button"
                    className="settings-delete-minimal-confirm"
                    onClick={handleDeleteAccount}
                  >
                    Confirm delete
                  </button>
                )}

                <button
                  type="button"
                  className="settings-logout-minimal"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
