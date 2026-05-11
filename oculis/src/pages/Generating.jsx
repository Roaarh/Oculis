// src/pages/GeneratingPage.jsx
import React, { useEffect, useState } from "react";
import { useTheme } from "../ThemeContext";
import Generating from "../components/Generating";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Generating.css";

// ✅ Global flag to prevent duplicate calls
let isGenerating = false;

export default function GeneratingPage() {
  const { theme, THEME_STYLES } = useTheme();
  const currentStyle = THEME_STYLES[theme];

  const [isMuted, setIsMuted] = React.useState(false);
  const toggleMute = () => setIsMuted((prev) => !prev);

  const location = useLocation();
  const navigate = useNavigate();
  const dreamData = location.state;

  const [error, setError] = useState(null);

  useEffect(() => {
    if (!dreamData || !dreamData.dreamId || !dreamData.dreamText) {
      console.error("❌ No dream data found in state");
      navigate("/dream-input");
      return;
    }

    const generateRoadmap = async () => {
      if (isGenerating) {
        console.log("⚠️ Already generating, skipping duplicate call");
        return;
      }

      isGenerating = true;

      try {
        console.log("🤖 Generating personalized roadmap...");
        console.log("Dream ID:", dreamData.dreamId);
        console.log("Dream text:", dreamData.dreamText);

        const userId = localStorage.getItem("oculis_user_id");
        if (!userId) {
          setError("User not logged in");
          isGenerating = false;
          return;
        }

        // Single step: AI generates AND saves roadmap (roadmaps + levels + tasks)
        const res = await fetch(
          "http://localhost:4000/api/ai/generate-roadmap",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              dreamId: dreamData.dreamId,
              dreamText: dreamData.dreamText,
            }),
          }
        );

        const data = await res.json();
        console.log("📦 /ai/generate-roadmap response:", {
          status: res.status,
          data,
        });

        if (!res.ok || !data.ok) {
          console.error("❌ AI generation failed:", data.error);
          setError(data.error || "Failed to generate roadmap");
          isGenerating = false;
          return;
        }

        const { roadmapId, dreamId } = data;
        console.log("✅ Roadmap generated & saved with ID:", roadmapId);

        // Wait for animation, then go to roadmap page
        setTimeout(() => {
          console.log("🔄 Navigating to roadmap page...");
          isGenerating = false;
          navigate(`/roadmap?dreamId=${dreamId}&roadmapId=${roadmapId}`);
        }, 2500);
      } catch (err) {
        console.error("🔴 Error during generation:", err);
        setError("Network error: " + err.message);
        isGenerating = false;
      }
    };

    generateRoadmap();

    return () => {
      isGenerating = false;
    };
  }, [dreamData, navigate]);

  return (
    <div
      className="generating-root"
      style={{
        background: currentStyle.background,
        color: currentStyle.text,
      }}
    >
      <main className="generating-main">
        <div className="generating-center">
          {error ? (
            <div style={{ textAlign: "center", color: "red" }}>
              <h2>⚠️ Error</h2>
              <p>{error}</p>
              <button onClick={() => navigate("/dream-input")}>
                Back to Dream Input
              </button>
            </div>
          ) : (
            <Generating
              dreamText={dreamData?.dreamText}
              isMuted={isMuted}
              toggleMute={toggleMute}
            />
          )}
        </div>
      </main>
    </div>
  );
}
