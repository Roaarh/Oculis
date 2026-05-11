// src/pages/AdminPanel.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/adminnav";
import { useTheme } from "../ThemeContext";
import "../styles/Admin-panel.css";

export default function AdminPanel() {
  const { theme, THEME_STYLES } = useTheme();
  const currentStyle = THEME_STYLES[theme];
  const navigate = useNavigate();

  const [stats, setStats] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("adminToken");
        if (!token) {
          navigate("/admin-login");
          return;
        }

        // Stats
        const res = await fetch("http://localhost:4000/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem("adminToken");
            navigate("/admin-login");
            return;
          }
          throw new Error("Failed to load stats");
        }

        const data = await res.json();
        setStats([
          { label: "Total users", value: data.totalUsers || 0 },
          { label: "Total dreams", value: data.totalDreams || 0 },
        ]);

        // Logs – try real logs, fallback to dummy
        try {
          const logsRes = await fetch(
            "http://localhost:4000/api/admin/logs",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (logsRes.ok) {
            const logsData = await logsRes.json();
            if (Array.isArray(logsData) && logsData.length > 0) {
              setLogs(
                logsData.map(
                  (l) =>
                    `${new Date(l.created_at).toLocaleString()} – ${l.message}`
                )
              );
            } else {
              setLogs([
                "No recent activity yet.",
              ]);
            }
          } else {
            setLogs([
              "User Roaa created a new dream roadmap.",
              "Admin logged in at 01:10 AM.",
              "User completed 3 roadmap tasks.",
              "New user registered.",
            ]);
          }
        } catch {
          setLogs([
            "User Roaa created a new dream roadmap.",
            "Admin logged in at 01:10 AM.",
            "User completed 3 roadmap tasks.",
            "New user registered.",
          ]);
        }
      } catch (err) {
        console.error("Stats fetch error:", err);
        setError("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin-login");
  };

  if (loading) {
    return (
      <div
        className="admin-root"
        style={{ background: currentStyle.background, color: currentStyle.text }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div
      className="admin-root"
      style={{
        background: currentStyle.background,
        color: currentStyle.text,
      }}
    >
      <Navbar currentStyle={currentStyle} />

      <div className="admin-layout">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <h2 className="admin-sidebar-title">Admin</h2>
          <nav className="admin-nav">
            <button
              className="admin-nav-link active"
              type="button"
              onClick={() => navigate("/admin-panel")}
            >
              Dashboard
            </button>
            <button
              className="admin-nav-link"
              type="button"
              onClick={() => navigate("/admin-panel/users")}
            >
              Users
            </button>
          </nav>
          <button
            className="admin-logout-btn"
            type="button"
            onClick={handleLogout}
          >
            Log out
          </button>
        </aside>

        {/* Main content */}
        <main className="admin-main">
          <header className="admin-header">
            <h1 className="admin-title">Dashboard</h1>
            <p className="admin-subtitle">
              Overview of users, dreams, and activity
            </p>
          </header>

          {error && (
            <div
              style={{
                color: "#ef4444",
                padding: "1rem",
                background: "#fee",
                borderRadius: "8px",
                marginBottom: "1rem",
              }}
            >
              {error}
            </div>
          )}

          {/* Stats cards */}
          <section className="admin-stats-grid">
            {stats.map((item, index) => (
              <div key={index} className="admin-stat-card">
                <span className="admin-stat-label">{item.label}</span>
                <span className="admin-stat-value">{item.value}</span>
              </div>
            ))}
          </section>

          {/* Logs */}
          <section className="admin-logs">
            <h2 className="admin-section-title">Recent activity</h2>
            <ul className="admin-logs-list">
              {logs.map((log, index) => (
                <li key={index} className="admin-log-item">
                  {log}
                </li>
              ))}
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
}
