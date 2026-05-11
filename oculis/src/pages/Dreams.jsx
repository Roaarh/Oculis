// src/pages/Dreams.jsx
import React, { useState, useEffect } from "react";
import "../styles/Dreams.css";
import { useTheme } from "../ThemeContext";
import { useNavigate } from "react-router-dom";
import SettingsButton from "../components/SettingsButton";

export default function Dreams() {
  const { theme, THEME_STYLES } = useTheme();
  const currentTheme = THEME_STYLES[theme];
  const navigate = useNavigate();

  const [dreams, setDreams] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDreams = async () => {
      try {
        setLoading(true);
        setError("");

        const userId = localStorage.getItem("oculis_user_id");
        if (!userId) {
          setError("No user found. Please log in again.");
          return;
        }

        const res = await fetch(
          `http://localhost:4000/api/dreams?userId=${userId}`
        );
        const data = await res.json();

        if (!res.ok || !data.ok) {
          setError(data.error || "Failed to load dreams");
          return;
        }

        const list = data.dreams || [];
        setDreams(list);
        setSelectedId(list.length > 0 ? list[0].id : null);
      } catch (err) {
        console.error("Dreams fetch error:", err);
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDreams();
  }, []);

  const selectedDream = dreams.find((d) => d.id === selectedId) || null;

  return (
    <div
      className="dreams-root"
      style={{ background: currentTheme.background, color: currentTheme.text }}
    >
      {/* Top bar */}
      <header className="dreams-topbar">
        <button
          className="dreams-home-btn"
          type="button"
          onClick={() => {
            const lastDreamId = localStorage.getItem("oculis_last_dream_id");
            const lastRoadmapId = localStorage.getItem(
              "oculis_last_roadmap_id"
            );

            if (lastDreamId && lastRoadmapId) {
              navigate(
                `/roadmap?dreamId=${lastDreamId}&roadmapId=${lastRoadmapId}`
              );
            } else if (lastDreamId) {
              navigate(`/roadmap?dreamId=${lastDreamId}`);
            } else {
              navigate("/roadmap");
            }
          }}
        >
          ⬅
        </button>

        <SettingsButton />
      </header>

      {/* Layout: left list, right detail */}
      <div className="dreams-layout">
        {/* left: list of dreams */}
        <aside className="dreams-list">
          <h2 className="dreams-list-title">All Dreams</h2>
          <button
            className="dreams-add-btn"
            type="button"
            onClick={() => navigate("/dream-input")}
          >
            + New Dream
          </button>

          {loading && (
            <p className="dreams-empty">Loading your dreams...</p>
          )}

          {error && !loading && (
            <p className="dreams-empty" style={{ color: "#f87171" }}>
              {error}
            </p>
          )}

          {!loading && !error && dreams.length === 0 && (
            <p className="dreams-empty">
              You have no dreams yet. Create your first one!
            </p>
          )}

          <ul>
            {dreams.map((dream) => (
              <li key={dream.id}>
                <button
                  type="button"
                  className={
                    "dream-item" +
                    (dream.id === selectedId ? " active" : "")
                  }
                  onClick={() => setSelectedId(dream.id)}
                >
                  <div className="dream-item-header">
                    <div className="dream-item-title">{dream.title}</div>
                    <div className="dream-item-progress-label">
                      {dream.progress}%
                    </div>
                  </div>

                  <div className="dream-item-sub">{dream.short}</div>

                  <div className="dream-progress-bar">
                    <div
                      className="dream-progress-fill"
                      style={{ width: `${dream.progress}%` }}
                    />
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* right: selected dream detail */}
        <main className="dreams-detail">
          {loading && <p>Loading...</p>}

          {!loading && !selectedDream && dreams.length === 0 && (
            <p>No dreams yet. Click "New Dream" to create one.</p>
          )}

          {!loading && !selectedDream && dreams.length > 0 && (
            <p>Select a dream from the list.</p>
          )}

          {!loading && selectedDream && (
            <>
              <h2>{selectedDream.title}</h2>
              <p className="dreams-detail-sub">{selectedDream.short}</p>
              <p className="dreams-detail-meta">
                Created at:{" "}
                {new Date(selectedDream.createdAt).toLocaleString()}
              </p>

              <div className="dreams-detail-progress-row">
                <span>Overall progress</span>
                <span>{selectedDream.progress}%</span>
              </div>
              <div className="dreams-detail-progress-bar">
                <div
                  className="dreams-detail-progress-fill"
                  style={{ width: `${selectedDream.progress}%` }}
                />
              </div>

              <div className="dreams-detail-actions">
                <button
                  type="button"
                  className="dreams-primary-btn"
                  onClick={() =>
                    navigate(`/roadmap?dreamId=${selectedDream.id}`)
                  }
                >
                  Open roadmap
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
