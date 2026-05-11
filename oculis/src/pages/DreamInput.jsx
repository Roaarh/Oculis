// src/pages/DreamInput.jsx
import React, { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import "../styles/DreamInput.css";
import ChatOrb from "../components/ChatOrb";
import Navbar from "../components/Navbar";
import { useTheme } from "../ThemeContext";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

export default function DreamInput() {
  const [dream, setDream] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { theme, THEME_STYLES } = useTheme();
  const currentStyle = THEME_STYLES[theme];

  const toggleMute = () => setIsMuted((prev) => !prev);

  const handleGenerate = async () => {
    const trimmed = dream.trim();
    if (!trimmed) return;

    const userId = localStorage.getItem("oculis_user_id");
    if (!userId) {
      console.error("❌ No userId found");
      setError("User not logged in");
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      console.log("💭 Step 1: Saving dream...");
      console.log("📦 Sending to /api/dreams:", {
        userId,
        dreamText: trimmed,
      });

      const dreamRes = await fetch("http://localhost:4000/api/dreams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          dreamText: trimmed,
        }),
      });

      const dreamData = await dreamRes.json();
      console.log("📤 Dream save response:", {
        status: dreamRes.status,
        dreamData,
      });

      if (!dreamRes.ok || !dreamData.ok) {
        console.error(
          "❌ Failed to save dream (branch triggered):",
          dreamData
        );
        setError(dreamData.error || "Failed to save dream");
        setIsGenerating(false);
        return;
      }

      console.log("✅ Passed save check, going to navigate now");

      const dreamId = dreamData.dreamId;
      console.log("✅ Dream saved with ID:", dreamId);

      console.log("🔄 Step 2: Navigating to generating page...");
      console.log("🔄 Navigating with state:", {
        dreamText: trimmed,
        dreamId,
        userId,
      });

      navigate("/generating", {
        state: {
          dreamText: trimmed,
          dreamId,
          userId,
        },
      });

      console.log("📍 After navigate call");
    } catch (err) {
      console.error("🔴 Error during dream processing:", err);
      setError("Network error: " + err.message);
      setIsGenerating(false);
    }
  };

  return (
    <div
      className="dream-root"
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

      <ChatOrb />

      <main className="dream-main">
        <h1 className="dream-title">Shape Your Vision</h1>
        <p className="dream-subtitle">
          Tell Oculis your dream, and let it guide your path
        </p>

        {error && (
          <div
            style={{
              color: "#ff6b6b",
              marginBottom: "1rem",
              textAlign: "center",
              fontSize: "0.9rem",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <TextareaAutosize
          minRows={1}
          maxRows={6}
          placeholder="Describe your dream…"
          value={dream}
          onChange={(e) => setDream(e.target.value)}
          className="dream-textarea"
          disabled={isGenerating}
        />

        <Button
          disabled={!dream.trim() || isGenerating}
          onClick={handleGenerate}
          className="dream-generate-btn"
        >
          {isGenerating ? "Processing..." : "Generate"}
        </Button>
      </main>

      <footer className="dream-footer">
        <div className="dream-footer-center"></div>
      </footer>
    </div>
  );
}
