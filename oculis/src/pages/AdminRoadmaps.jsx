// src/pages/AdminRoadmaps.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useTheme } from "../ThemeContext";
import "../styles/AdminRoadmaps.css";

export default function AdminRoadmaps() {
  const { theme, THEME_STYLES } = useTheme();
  const currentStyle = THEME_STYLES[theme];
  const navigate = useNavigate();

  // dummy dreams/roadmaps data
  const dreams = [
    {
      id: 1,
      title: "Become a full-stack developer",
      user: "Lina",
      email: "lina@example.com",
      status: "Active",
      tasks: 12,
    },
    {
      id: 2,
      title: "Start a design portfolio",
      user: "Sam",
      email: "sam@example.com",
      status: "Completed",
      tasks: 8,
    },
    {
      id: 3,
      title: "Launch a small business",
      user: "Noah",
      email: "noah@example.com",
      status: "In review",
      tasks: 10,
    },
  ];

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredDreams = useMemo(() => {
    return dreams.filter((d) => {
      const matchesSearch =
        d.title.toLowerCase().includes(search.toLowerCase()) ||
        d.user.toLowerCase().includes(search.toLowerCase()) ||
        d.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "All" ? true : d.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [dreams, search, statusFilter]);

  const handleViewByUser = (email) => {
    console.log("view dreams by user", email);
  };

  const handleViewAnalysis = (id) => {
    console.log("view analysis for dream", id);
  };

  return (
    <div
      className="admin-root"
      style={{
        background: currentStyle.background,
        color: currentStyle.text,
      }}
    >
      

      <main className="admin-roadmaps-main">
        {/* Back + header */}
        <div className="admin-roadmaps-top">
          <button
            type="button"
            className="admin-back-dashboard-btn"
            onClick={() => navigate("/admin-panel")}
          >
            ← Back to dashboard
          </button>

          <div className="admin-roadmaps-header">
            <h1 className="admin-roadmaps-title">Roadmaps & dreams</h1>
            <p className="admin-roadmaps-subtitle">
              View all dreams, filter by user, and inspect analysis
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="admin-roadmaps-filters">
          <input
            type="text"
            placeholder="Search by title or user"
            className="admin-roadmaps-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="admin-roadmaps-filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All statuses</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="In review">In review</option>
          </select>
        </div>

        {/* Table */}
        <div className="admin-roadmaps-table-wrapper">
          <table className="admin-roadmaps-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Dream title</th>
                <th>User</th>
                <th>Email</th>
                <th>Status</th>
                <th>Tasks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDreams.map((d) => (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td>{d.title}</td>
                  <td>{d.user}</td>
                  <td>{d.email}</td>
                  <td>
                    <span
                      className={
                        "admin-roadmaps-badge " +
                        (d.status === "Completed"
                          ? "admin-roadmaps-badge-completed"
                          : d.status === "Active"
                          ? "admin-roadmaps-badge-active"
                          : "admin-roadmaps-badge-review")
                      }
                    >
                      {d.status}
                    </span>
                  </td>
                  <td>{d.tasks}</td>
                  <td>
                    <div className="admin-roadmaps-actions">
                      <button
                        type="button"
                        className="admin-roadmaps-btn admin-roadmaps-btn-user"
                        onClick={() => handleViewByUser(d.email)}
                      >
                        👤 By user
                      </button>
                      <button
                        type="button"
                        className="admin-roadmaps-btn admin-roadmaps-btn-analysis"
                        onClick={() => handleViewAnalysis(d.id)}
                      >
                        📊 Analysis
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredDreams.length === 0 && (
                <tr>
                  <td colSpan={7} className="admin-roadmaps-empty">
                    No dreams found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
