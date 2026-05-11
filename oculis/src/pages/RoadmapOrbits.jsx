// src/pages/RoadmapOrbits.jsx
import React, { useState, useEffect } from "react";
import "../styles/RoadmapOrbits.css";
import { useTheme } from "../ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";
import ChatOrb from "../components/ChatOrb";
import SoundSwitch from "../components/SoundSwitch";
import SettingsButton from "../components/SettingsButton";

const calcProgress = (tasks) => {
  if (!tasks.length) return 0;
  const done = tasks.filter((t) => t.done).length;
  return Math.round((done / tasks.length) * 100);
};

const checkAndCompleteRoadmap = async (updatedLevels, location) => {
  const allLevelsComplete = updatedLevels.every((lvl) => lvl.progress === 100);

  if (allLevelsComplete) {
    console.log("🎉 All levels completed! Marking roadmap as complete...");

    const userId = localStorage.getItem("oculis_user_id");
    const params = new URLSearchParams(location.search);
    const roadmapId = params.get("roadmapId");

    if (!roadmapId) {
      console.warn("⚠️ No roadmapId found in URL");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:4000/api/roadmaps/${roadmapId}/complete`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );

      const data = await res.json();
      if (res.ok && data.ok) {
        console.log("✅ Roadmap marked as completed!");
        alert("🎉 Congratulations! You've completed this roadmap!");
      }
    } catch (err) {
      console.error("❌ Failed to mark roadmap as complete:", err);
    }
  }
};

export default function RoadmapSolar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, THEME_STYLES } = useTheme();
  const currentTheme = THEME_STYLES[theme];

  const [levels, setLevels] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [justCompletedId, setJustCompletedId] = useState(null);

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  useEffect(() => {
    if (!justCompletedId) return;
    const t = setTimeout(() => setJustCompletedId(null), 900);
    return () => clearTimeout(t);
  }, [justCompletedId]);

  // Read dreamId from URL (e.g. /roadmap?dreamId=123)
  const params = new URLSearchParams(location.search);
  const dreamId = params.get("dreamId");

  useEffect(() => {
    console.log("Opened roadmap for dreamId:", dreamId);
  }, [dreamId]);

  // Remember last opened dream/roadmap for the Dreams back button
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const roadmapId = urlParams.get("roadmapId");

    if (dreamId) {
      localStorage.setItem("oculis_last_dream_id", dreamId);
    }
    if (roadmapId) {
      localStorage.setItem("oculis_last_roadmap_id", roadmapId);
    }
  }, [dreamId]);

  // Load levels + tasks from backend
  useEffect(() => {
    if (!dreamId) return;

    const fetchRoadmap = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/dreams/${dreamId}/roadmap`
        );
        const data = await res.json();

        console.log("🚀 roadmap data:", data);

        if (!res.ok || !data.ok) {
          console.error("Failed to load roadmap:", data);
          return;
        }

        const loadedLevels = data.levels.map((lvl, idx) => {
          const tasks = lvl.tasks || [];
          return {
            id: lvl.id,
            title: lvl.name,
            unlocked: idx === 0,
            tasks: tasks.map((t) => ({
              id: t.id,
              label: t.title,
              description: t.description,
              done: t.done,
            })),
            progress: calcProgress(tasks.map((t) => ({ done: t.done }))),
          };
        });

        for (let i = 1; i < loadedLevels.length; i++) {
          loadedLevels[i].unlocked = loadedLevels[i - 1].progress === 100;
        }

        setLevels(loadedLevels);
      } catch (err) {
        console.error("Error loading roadmap:", err);
      }
    };

    fetchRoadmap();
  }, [dreamId]);

  const unlockNext = (updated, selectedId) => {
    const index = updated.findIndex((l) => l.id === selectedId);
    if (index === -1) return;
    if (updated[index].progress === 100 && index < updated.length - 1) {
      updated[index + 1].unlocked = true;
      setJustCompletedId(selectedId);
    }
  };

  const updateDreamProgress = async (updatedLevels) => {
    if (!dreamId) return;

    const totalTasks = updatedLevels.reduce(
      (sum, lvl) => sum + lvl.tasks.length,
      0
    );
    const doneTasks = updatedLevels.reduce(
      (sum, lvl) => sum + lvl.tasks.filter((t) => t.done).length,
      0
    );

    const progress =
      totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

    try {
      await fetch(`http://localhost:4000/api/dreams/${dreamId}/progress`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress }),
      });
      console.log("🌌 Updated dream progress to", progress, "%");
    } catch (err) {
      console.error("Failed to update dream progress:", err);
    }
  };

  const toggleTask = (taskId) => {
    if (!selected) return;

    const currentLevelObj = levels.find((lvl) => lvl.id === selected.id);
    const currentTask = currentLevelObj?.tasks.find((t) => t.id === taskId);
    const newDone = !currentTask?.done;

    setLevels((prev) => {
      const updated = prev.map((lvl) => {
        if (lvl.id !== selected.id) return lvl;
        const newTasks = lvl.tasks.map((t) =>
          t.id === taskId ? { ...t, done: !t.done } : t
        );
        return { ...lvl, tasks: newTasks, progress: calcProgress(newTasks) };
      });

      unlockNext(updated, selected.id);
      checkAndCompleteRoadmap(updated, location);
      updateDreamProgress(updated);
      return updated;
    });

    (async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/tasks/${taskId}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ done: newDone }),
          }
        );
        const data = await res.json();
        console.log("PATCH /tasks response:", res.status, data);
      } catch (err) {
        console.error("Failed to patch task:", err);
      }
    })();
  };

  const startEditTask = (task) => {
    setEditingTaskId(task.id);
    setEditingValue(task.label);
  };

  const saveTaskEdit = (taskId) => {
    if (!selected) return;
    const newTitle = editingValue.trim();

    setLevels((prev) => {
      const updated = prev.map((lvl) => {
        if (lvl.id !== selected.id) return lvl;
        const newTasks = lvl.tasks.map((t) =>
          t.id === taskId ? { ...t, label: newTitle || t.label } : t
        );
        return { ...lvl, tasks: newTasks, progress: calcProgress(newTasks) };
      });
      unlockNext(updated, selected.id);
      updateDreamProgress(updated);
      return updated;
    });

    (async () => {
      try {
        await fetch(`http://localhost:4000/api/tasks/${taskId}/title`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: newTitle }),
        });
      } catch (err) {
        console.error("Failed to update task title:", err);
      }
    })();

    setEditingTaskId(null);
    setEditingValue("");
  };

  const deleteTask = (taskId) => {
    if (!selected) return;

    setLevels((prev) => {
      const updated = prev.map((lvl) => {
        if (lvl.id !== selected.id) return lvl;
        const newTasks = lvl.tasks.filter((t) => t.id !== taskId);
        return { ...lvl, tasks: newTasks, progress: calcProgress(newTasks) };
      });
      unlockNext(updated, selected.id);
      updateDreamProgress(updated);
      return updated;
    });

    (async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/tasks/${taskId}`,
          { method: "DELETE" }
        );
        const data = await res.json();
        console.log("DELETE /tasks:", res.status, data);
      } catch (err) {
        console.error("Failed to delete task:", err);
      }
    })();
  };

  const addTask = () => {
    if (!selected) return;
    setLevels((prev) => {
      const updated = prev.map((lvl) => {
        if (lvl.id !== selected.id) return lvl;
        const newId = `temp-${lvl.id}-${lvl.tasks.length + 1}`;
        const newTasks = [
          ...lvl.tasks,
          { id: newId, label: `New task ${lvl.tasks.length + 1}`, done: false },
        ];
        return { ...lvl, tasks: newTasks, progress: calcProgress(newTasks) };
      });
      unlockNext(updated, selected.id);
      updateDreamProgress(updated);
      return updated;
    });
  };

  const handleLogout = () => {
    navigate("/auth");
  };

  const currentLevel = selected && levels.find((l) => l.id === selected.id);

  const circleRadius = 16;
  const circleCircumference = 2 * Math.PI * circleRadius;

  return (
    <div
      className="solar-root"
      style={{ background: currentTheme.background, color: currentTheme.text }}
    >
      {/* SIDEBAR */}
      <aside className={`solar-sidebar ${sidebarOpen ? "open" : ""}`}>
        <button className="close-sb" onClick={() => setSidebarOpen(false)}>
          ✕
        </button>

        <div className="sb-header-row">
          <h2 className="sb-title">Oculis</h2>
          <div className="sb-orb" />
        </div>

        <nav className="sb-links">
          <button onClick={() => navigate("/profile")}>Profile</button>
          <button onClick={() => navigate("/dreams")}>My Dreams</button>
        </nav>

        <button className="sb-logout" onClick={handleLogout}>
          Log out
        </button>
      </aside>

      <ChatOrb />

      {/* TOP BAR */}
      <header className="solar-topbar">
        <button onClick={() => setSidebarOpen(true)} className="menu-btn">
          ☰
        </button>

        <div className="solar-top-right">
          <SoundSwitch />
          <SettingsButton />
        </div>
      </header>

      {/* SOLAR SYSTEM */}
      <div className="solar-system">
        <div className="solar-stars solar-stars-back" />
        <div className="solar-stars solar-stars-front" />

        <div className="sun">
          <span className="sun-label" />
        </div>

        {levels.map((lvl, index) => {
          const orbitDistance = 70 + index * 35;
          const duration = 10 + index * 2;
          const isReverse = index % 2 === 1;

          return (
            <button
              key={lvl.id}
              className={[
                "planet",
                lvl.unlocked ? "unlocked" : "locked",
                lvl.progress === 100 ? "completed" : "",
                isReverse ? "reverse" : "",
                justCompletedId === lvl.id ? "ping" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={{
                "--orbit": `${orbitDistance}px`,
                "--duration": `${duration}s`,
                "--planet-glow": "rgba(255, 210, 40, 0.85)",
              }}
              onClick={() => lvl.unlocked && setSelected(lvl)}
              data-tooltip={`${lvl.title} • ${lvl.progress}%`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      {/* POPUP */}
      {currentLevel && (
        <div className="popup-bg">
          <div className="popup-card">
            <button
              className="close-popup"
              onClick={() => setSelected(null)}
            >
              ✕
            </button>

            <div className="popup-header-row">
              <div>
                <h2>{currentLevel.title}</h2>
              </div>
              <div className="level-ring" aria-label="Level progress">
                <svg viewBox="0 0 40 40">
                  <circle
                    className="ring-bg"
                    cx="20"
                    cy="20"
                    r={circleRadius}
                  />
                  <circle
                    className="ring-fg"
                    cx="20"
                    cy="20"
                    r={circleRadius}
                    style={{
                      strokeDasharray: circleCircumference,
                      strokeDashoffset:
                        ((100 - currentLevel.progress) / 100) *
                        circleCircumference,
                    }}
                  />
                  <text
                    x="20"
                    y="22"
                    textAnchor="middle"
                    className="ring-text"
                  >
                    {currentLevel.progress}%
                  </text>
                </svg>
              </div>
            </div>

            <ul className="task-list">
              {currentLevel.tasks.map((t) => (
                <li
                  key={t.id}
                  className={t.done ? "task done" : "task"}
                  style={{
                    background: t.done
                      ? "rgba(81, 207, 102, 0.15)"
                      : "rgba(51, 65, 85, 0.35)",
                    border: t.done
                      ? "2px solid rgba(81, 207, 102, 0.5)"
                      : "2px solid rgba(148, 163, 184, 0.4)",
                    padding: "18px",
                    borderRadius: "14px",
                    marginBottom: "14px",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    minHeight: "75px",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = t.done
                      ? "rgba(81, 207, 102, 0.2)"
                      : "rgba(51, 65, 85, 0.5)";
                    e.currentTarget.style.borderColor =
                      "rgba(21, 235, 250, 0.6)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 24px rgba(21, 235, 250, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = t.done
                      ? "rgba(81, 207, 102, 0.15)"
                      : "rgba(51, 65, 85, 0.35)";
                    e.currentTarget.style.borderColor = t.done
                      ? "rgba(81, 207, 102, 0.5)"
                      : "rgba(148, 163, 184, 0.4)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <button
                    className="task-dot"
                    onClick={() => toggleTask(t.id)}
                    aria-label="Toggle task"
                    style={{
                      width: "32px",
                      height: "32px",
                      minWidth: "32px",
                      borderRadius: "10px",
                      border: t.done
                        ? "2px solid #51cf66"
                        : "2px solid rgba(148, 163, 184, 0.7)",
                      background: t.done ? "#51cf66" : "transparent",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: t.done ? "#0f172a" : "#94a3b8",
                      fontSize: "18px",
                      fontWeight: "bold",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {t.done ? "✓" : ""}
                  </button>

                  {editingTaskId === t.id ? (
                    <input
                      className="task-edit-input"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      onBlur={() => saveTaskEdit(t.id)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && saveTaskEdit(t.id)
                      }
                      autoFocus
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        border: "2px solid rgba(21, 235, 250, 0.4)",
                        color: currentTheme.text,
                        padding: "10px 14px",
                        borderRadius: "8px",
                        flex: 1,
                        fontSize: "1rem",
                        fontWeight: "600",
                      }}
                    />
                  ) : (
                    <div style={{ flex: 1 }}>
                      <p
                        className="task-label"
                        onClick={() => startEditTask(t)}
                        style={{
                          fontWeight: "700",
                          margin: 0,
                          marginBottom: "4px",
                          fontSize: "1.05rem",
                          color: t.done ? "#51cf66" : "#f1f5f9",
                          cursor: "pointer",
                          transition: "color 0.2s ease",
                        }}
                        onMouseEnter={(e) =>
                          (e.target.style.color = "#15faee")
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.color = t.done
                            ? "#51cf66"
                            : "#f1f5f9")
                        }
                      >
                        {t.label}
                      </p>
                      <p
                        style={{
                          fontSize: "0.9rem",
                          opacity: 0.7,
                          margin: 0,
                          color: t.done
                            ? "rgba(81, 207, 102, 0.8)"
                            : "rgba(226, 232, 240, 0.75)",
                        }}
                      >
                        {t.description}
                      </p>
                    </div>
                  )}

                  {t.priority && (
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        background:
                          t.priority === "high"
                            ? "rgba(255, 107, 107, 0.2)"
                            : "rgba(255, 165, 0, 0.2)",
                        color:
                          t.priority === "high" ? "#ff6b6b" : "#ffa500",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        border:
                          t.priority === "high"
                            ? "1px solid rgba(255, 107, 107, 0.4)"
                            : "1px solid rgba(255, 165, 0, 0.4)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {t.priority}
                    </span>
                  )}

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      className="task-edit-btn"
                      onClick={() => startEditTask(t)}
                      aria-label="Edit task"
                      style={{
                        background: "rgba(148, 163, 184, 0.15)",
                        border: "1px solid rgba(148, 163, 184, 0.3)",
                        cursor: "pointer",
                        fontSize: "1.2rem",
                        color: currentTheme.text,
                        padding: "8px 12px",
                        borderRadius: "8px",
                        transition: "all 0.2s ease",
                      }}
                    >
                      ✏
                    </button>
                    <button
                      className="task-delete-btn"
                      onClick={() => deleteTask(t.id)}
                      aria-label="Delete task"
                      style={{
                        background: "rgba(255, 107, 107, 0.15)",
                        border: "1px solid rgba(255, 107, 107, 0.3)",
                        cursor: "pointer",
                        fontSize: "1.2rem",
                        color: "#ff6b6b",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        transition: "all 0.2s ease",
                      }}
                    >
                      ×
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <button
              className="add-task-btn"
              onClick={addTask}
              style={{
                width: "100%",
                padding: "14px",
                marginTop: "16px",
                background: "rgba(21, 235, 250, 0.08)",
                border: "2px dashed rgba(21, 235, 250, 0.5)",
                color: currentTheme.text,
                borderRadius: "12px",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "700",
                transition: "all 0.3s ease",
                letterSpacing: "0.5px",
              }}
            >
              + Add Task
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
