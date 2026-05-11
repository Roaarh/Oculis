// src/pages/Profile.jsx
import React, { useEffect, useRef, useState } from "react";
import "../styles/Profile.css";
import Navbar from "../components/Navbar";
import { useTheme } from "../ThemeContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { theme, THEME_STYLES } = useTheme();
  const currentStyle = THEME_STYLES[theme];
  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(""); // backend is source of truth

  const [dreamsCreated, setDreamsCreated] = useState(0);
  const [roadmapsCompleted, setRoadmapsCompleted] = useState(0);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load username, bio, avatar, stats from DB on mount
  useEffect(() => {
    const userId = localStorage.getItem("oculis_user_id");
    console.log("🔍 Profile useEffect - userId from localStorage:", userId);

    if (!userId) {
      console.warn("⚠️ No userId found in localStorage");
      setLoading(false);
      return;
    }

    async function fetchAccountData() {
      try {
        console.log("📡 Fetching account data for userId:", userId);
        const res = await fetch(
          `http://localhost:4000/api/user/account?userId=${userId}`
        );
        const data = await res.json();

        console.log("📦 API Response:", { status: res.status, data });

        if (res.ok && data.ok && data.account) {
          const acc = data.account;
          console.log("✅ Account data loaded:", acc);

          setUsername(acc.username || "");
          setBio(acc.bio || "");

          if (acc.avatar_url) {
            // Use avatar from DB
            setAvatarPreview(acc.avatar_url);
            localStorage.setItem("avatarDataUrl", acc.avatar_url);
          } else {
            // Clear any stale local avatar for new users
            setAvatarPreview("");
            localStorage.removeItem("avatarDataUrl");
          }

          console.log("📊 Dreams created:", acc.dreams_created);
          console.log("📊 Roadmaps completed:", acc.roadmaps_completed);
          setDreamsCreated(acc.dreams_created || 0);
          setRoadmapsCompleted(acc.roadmaps_completed || 0);
        } else {
          console.warn("❌ API returned not ok:", data);
        }
      } catch (err) {
        console.error("🔴 Failed to load account data", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAccountData();
  }, []);

  const handleAvatarClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  // Handle avatar selection and save immediately to DB, with size limit
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limit to 1 MB (adjust if you want)
    const MAX_SIZE_BYTES = 1024 * 1024; // 1 MB
    if (file.size > MAX_SIZE_BYTES) {
      alert("Please choose an image under 1 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const result = reader.result; // base64 string
      console.log("🖼️ Avatar selected, size:", result.length);
      setAvatarPreview(result);
      localStorage.setItem("avatarDataUrl", result);

      const userId = localStorage.getItem("oculis_user_id");
      console.log("📤 Saving avatar for userId:", userId);
      if (!userId) {
        console.warn("⚠️ No userId, cannot save avatar");
        return;
      }

      try {
        const res = await fetch("http://localhost:4000/api/user/account", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            avatarUrl: result,
          }),
        });
        const data = await res.json();
        console.log("📤 Avatar save response:", { status: res.status, data });
      } catch (err) {
        console.error("🔴 Failed to save avatar", err);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle save of username and bio
  const handleSave = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("oculis_user_id");
    console.log("💾 Save button clicked, userId:", userId);

    if (!userId) {
      console.warn("⚠️ No userId, cannot save");
      return;
    }

    setSaving(true);
    try {
      console.log("📤 Sending save request with:", { userId, username, bio });
      const res = await fetch("http://localhost:4000/api/user/account", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          username,
          bio,
        }),
      });

      const data = await res.json();
      console.log("📥 Save response:", { status: res.status, data });

      if (!res.ok || !data.ok) {
        console.error("❌ Failed to save account", data.error);
        return;
      }

      console.log("✅ Account saved successfully");
      localStorage.setItem("username", username);
      localStorage.setItem("bio", bio);
    } catch (err) {
      console.error("🔴 Failed to save account", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="profile-root"
      style={{
        background: currentStyle.background,
        color: currentStyle.text,
      }}
    >
      <main className="profile-main">
        <div className="profile-card">
          <button
            type="button"
            className="profile-back-btn"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          <h1 className="profile-title">Your profile</h1>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              {/* Avatar + username display */}
              <section className="profile-top">
                <div
                  className="profile-avatar-wrapper"
                  onClick={handleAvatarClick}
                >
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="profile-avatar-img"
                    />
                  ) : (
                    <div className="profile-avatar-placeholder">
                      {username.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                  <div className="profile-avatar-badge">Change photo</div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: "none" }}
                  />
                </div>

                <div className="profile-name-block">
                  <div className="profile-username">@{username}</div>
                </div>
              </section>

              {/* Editable fields form */}
              <form className="profile-form" onSubmit={handleSave}>
                <label className="profile-label">
                  <span>Username</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="profile-input"
                    placeholder="Enter your username"
                  />
                </label>

                <label className="profile-label">
                  <span>About you</span>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="profile-textarea"
                    rows={3}
                    placeholder="Tell me more about you"
                  />
                </label>

                <button
                  type="submit"
                  className="profile-save-btn"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </form>

              {/* Progress section */}
              <section className="profile-progress-card">
                <h2 className="profile-progress-title">Your progress</h2>
                <div className="profile-progress-grid">
                  <div className="profile-progress-item">
                    <span className="profile-progress-label">
                      Dreams created
                    </span>
                    <span className="profile-progress-value">
                      {dreamsCreated}
                    </span>
                  </div>
                  <div className="profile-progress-item">
                    <span className="profile-progress-label">
                      Roadmaps completed
                    </span>
                    <span className="profile-progress-value">
                      {roadmapsCompleted}
                    </span>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
