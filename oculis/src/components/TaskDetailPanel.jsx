import React from "react";
import "../styles/TaskDetailPanel.css";

export default function TaskDetailPanel({
  level,
  circleRadius,
  circleCircumference,
  onClose,
  onToggleTask,
  onEditTask,
  onSaveEdit,
  onDeleteTask,
  onAddTask,
  onUpdateDescription,
  onUpdatePriority,
  editingTaskId,
  editingValue,
  setEditingValue,
  showTaskForm,
  setShowTaskForm,
  newTaskTitle,
  setNewTaskTitle,
  newTaskDescription,
  setNewTaskDescription,
  newTaskPriority,
  setNewTaskPriority,
}) {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#ff6b6b";
      case "medium":
        return "#ffd93d";
      case "low":
        return "#6bcf7f";
      default:
        return "#95a5a6";
    }
  };

  const getPriorityLabel = (priority) => {
    return priority ? priority.toUpperCase() : "MEDIUM";
  };

  return (
    <div className="task-popup-bg">
      <div className="task-popup-card">
        {/* Header */}
        <div className="task-popup-header">
          <div className="task-header-left">
            <h2 className="task-level-title">{level.title}</h2>
            <p className="task-header-subtitle">
              Shape these tasks to match your reality. When this level hits 100%, the next one unlocks.
            </p>
          </div>

          <div className="task-progress-ring">
            <svg viewBox="0 0 40 40" className="ring-svg">
              circle className="ring-bg" cx="20" cy="20" r={circleRadius} 
              circle
                className="ring-fg"
                cx="20"
                cy="20"
                r={circleRadius}
                style={{
                  strokeDasharray: circleCircumference,
                  strokeDashoffset:
                    ((100 - level.progress) / 100) * circleCircumference,
                }}
              
              <text x="20" y="22" textAnchor="middle" className="ring-text">
                {level.progress}%
              </text>
            </svg>
          </div>

          <button className="task-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Task Statistics */}
        <div className="task-stats-bar">
          <div className="stat-item">
            <span className="stat-label">Total</span>
            <span className="stat-value">{level.tasks.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Completed</span>
            <span className="stat-value completed">
              {level.tasks.filter((t) => t.done).length}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Remaining</span>
            <span className="stat-value pending">
              {level.tasks.filter((t) => !t.done).length}
            </span>
          </div>
        </div>

        {/* Tasks List */}
        <div className="task-list-container">
          <div className="task-list-header">
            <h3>Tasks</h3>
            <span className="task-count">{level.tasks.length}</span>
          </div>

          <ul className="task-list-detailed">
            {level.tasks.map((t) => (
              <li
                key={t.id}
                className={`task-card ${t.done ? "task-done" : ""}`}
              >
                <div className="task-card-content">
                  {/* Checkbox */}
                  <button
                    className="task-checkbox-btn"
                    onClick={() => onToggleTask(t.id)}
                    aria-label="Toggle task"
                  >
                    {t.done && <span className="task-check-icon">✓</span>}
                  </button>

                  {/* Task Main Content */}
                  <div className="task-main-content">
                    {editingTaskId === t.id ? (
                      <input
                        className="task-title-input"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onBlur={() => onSaveEdit(t.id)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && onSaveEdit(t.id)
                        }
                        autoFocus
                      />
                    ) : (
                      <h4
                        className="task-title"
                        onClick={() => onEditTask(t)}
                      >
                        {t.label}
                      </h4>
                    )}

                    {/* Task Description */}
                    {t.description && (
                      <p className="task-description">{t.description}</p>
                    )}

                    {/* Task Metadata */}
                    <div className="task-metadata">
                      <div className="task-priority">
                        <span
                          className="priority-badge"
                          style={{
                            backgroundColor: getPriorityColor(t.priority),
                          }}
                        >
                          {getPriorityLabel(t.priority)}
                        </span>
                      </div>

                      {t.tags && t.tags.length > 0 && (
                        <div className="task-tags">
                          {t.tags.map((tag, idx) => (
                            <span key={idx} className="tag">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Task Actions */}
                  <div className="task-actions">
                    <button
                      className="task-action-btn task-edit"
                      onClick={() => onEditTask(t)}
                      title="Edit task"
                    >
                      ✎
                    </button>
                    <button
                      className="task-action-btn task-delete"
                      onClick={() => onDeleteTask(t.id)}
                      title="Delete task"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Empty State */}
          {level.tasks.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <p>No tasks yet. Add one to get started!</p>
            </div>
          )}
        </div>

        {/* Add Task Form / Button */}
        <div className="task-form-section">
          {showTaskForm ? (
            <div className="task-form">
              <h3>Create New Task</h3>

              <div className="form-group">
                <label htmlFor="task-title">Task Title</label>
                <input
                  id="task-title"
                  type="text"
                  placeholder="What needs to be done?"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="form-input"
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label htmlFor="task-desc">Description</label>
                <textarea
                  id="task-desc"
                  placeholder="Add details about this task..."
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  className="form-textarea"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="task-priority">Priority</label>
                <select
                  id="task-priority"
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value)}
                  className="form-select"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="form-actions">
                <button
                  className="btn-cancel"
                  onClick={() => {
                    setShowTaskForm(false);
                    setNewTaskTitle("");
                    setNewTaskDescription("");
                    setNewTaskPriority("medium");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn-submit"
                  onClick={onAddTask}
                  disabled={!newTaskTitle.trim()}
                >
                  Create Task
                </button>
              </div>
            </div>
          ) : (
            <button
              className="add-task-btn-main"
              onClick={() => setShowTaskForm(true)}
            >
              <span className="plus-icon">+</span> Add Task
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
