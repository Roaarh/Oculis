import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import "../styles/AdminUsers.css";

export default function AdminUsers() {
  const { theme, THEME_STYLES } = useTheme();
  const currentStyle = THEME_STYLES[theme];
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Fetch real users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("adminToken");
        
        if (!token) {
          navigate("/admin-login");
          return;
        }

        const res = await fetch("http://localhost:4000/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem("adminToken");
            navigate("/admin-login");
            return;
          }
          throw new Error("Failed to load users");
        }
        
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError("Failed to load users");
        console.error("Users fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [navigate]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "All" ? true : u.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [users, search, statusFilter]);

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "Active").length;
  const deactivatedUsers = users.filter((u) => u.status !== "Active").length;

  const handleEdit = (id) => {
    console.log("edit user", id);
    // navigate(`/admin-panel/users/${id}`); // Later
  };

  const handleToggleActive = (id) => {
    console.log("toggle active", id);
    // Backend call later
  };

  const handleDelete = (id) => {
    console.log("delete user", id);
    // Backend call later
  };

  return (
    <div
      className="admin-root"
      style={{
        background: currentStyle.background,
        color: currentStyle.text,
      }}
    >
      <main className="admin-users-main">
        <div className="admin-users-top">
          <button
            type="button"
            className="admin-back-dashboard-btn"
            onClick={() => navigate("/admin-panel")}
          >
            ← Back to dashboard
          </button>

          <div className="admin-users-header">
            <h1 className="admin-users-title">Users</h1>
            <p className="admin-users-subtitle">
              View and manage all Oculis users
            </p>
          </div>
        </div>

        {/* Summary chips */}
        <div className="admin-users-summary">
          <div className="admin-users-chip">
            <span className="admin-users-chip-label">Total</span>
            <span className="admin-users-chip-value">{totalUsers}</span>
          </div>
          <div className="admin-users-chip admin-users-chip-active">
            <span className="admin-users-chip-label">Active</span>
            <span className="admin-users-chip-value">{activeUsers}</span>
          </div>
          <div className="admin-users-chip admin-users-chip-inactive">
            <span className="admin-users-chip-label">Deactivated</span>
            <span className="admin-users-chip-value">{deactivatedUsers}</span>
          </div>
        </div>

        {/* Filters: search + status */}
        <div className="admin-users-filters">
          <input
            type="text"
            placeholder="Search"
            className="admin-users-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={loading}
          />
          <select
            className="admin-users-filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            disabled={loading}
          >
            <option value="All">All statuses</option>
            <option value="Active">Active</option>
            <option value="Deactivated">Deactivated</option>
          </select>
        </div>

        {/* Table */}
        <div className="admin-users-table-wrapper">
          {loading && (
            <div className="admin-users-empty" style={{ color: currentStyle.text }}>
              Loading users...
            </div>
          )}
          {error && (
            <div className="admin-users-empty" style={{ color: "#ef4444" }}>
              {error}
            </div>
          )}
          
          {!loading && !error && (
            <table className="admin-users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Dreams</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name || "N/A"}</td>
                    <td>{u.email}</td>
                    <td>
                      <span
                        className={
                          "admin-badge " +
                          (u.status === "Active"
                            ? "admin-badge-active"
                            : "admin-badge-inactive")
                        }
                      >
                        {u.status}
                      </span>
                    </td>
                    <td>{u.dreams}</td>
                    <td>
                      <div className="admin-users-actions">
                        <button
                          type="button"
                          className="admin-users-btn admin-users-btn-edit"
                          onClick={() => handleEdit(u.id)}
                        >
                          ✏ Edit
                        </button>
                        <button
                          type="button"
                          className="admin-users-btn admin-users-btn-toggle"
                          onClick={() => handleToggleActive(u.id)}
                        >
                          {u.status === "Active" ? "⏸ Deactivate" : "▶ Activate"}
                        </button>
                        <button
                          type="button"
                          className="admin-users-btn admin-users-btn-delete"
                          onClick={() => handleDelete(u.id)}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredUsers.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="admin-users-empty">
                      No users found for this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
