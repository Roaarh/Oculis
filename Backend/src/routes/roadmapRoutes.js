// backend/routes/roadmapRoutes.js
const express = require("express");
const router = express.Router();
const pool = require("../config/db");

/**
 * POST /api/roadmaps
 * Save generated roadmap JSON for a dream
 */
router.post("/roadmaps", async (req, res) => {
  try {
    const { userId, dreamId, roadmapData } = req.body;

    console.log("📥 /api/roadmaps - Saving roadmap for dreamId:", dreamId);

    if (!userId || !dreamId || !roadmapData) {
      return res.status(400).json({
        ok: false,
        error: "userId, dreamId, and roadmapData are required",
      });
    }

    const sql = `
      INSERT INTO roadmaps (user_id, dream_id, title, description, content) 
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(sql, [
      userId,
      dreamId,
      roadmapData.roadmapTitle || "Untitled Roadmap",
      "Generated roadmap for your dream",
      JSON.stringify(roadmapData),
    ]);

    console.log("✅ Roadmap saved with id:", result.insertId);
    console.log(
      "⏳ Roadmap not marked as completed yet (user must finish all levels)"
    );

    return res.status(201).json({
      ok: true,
      roadmapId: result.insertId,
    });
  } catch (err) {
    console.error("❌ POST /api/roadmaps error:", err.message);
    return res.status(500).json({
      ok: false,
      error: "Failed to save roadmap: " + err.message,
    });
  }
});

/**
 * PUT /api/roadmaps/:id/complete
 */
router.put("/roadmaps/:id/complete", async (req, res) => {
  try {
    const roadmapId = req.params.id;
    const { userId } = req.body;

    console.log("📥 Marking roadmap as completed:", roadmapId);

    if (!userId) {
      return res.status(400).json({ ok: false, error: "userId is required" });
    }

    await pool.query(
      "UPDATE roadmaps SET completed_at = NOW() WHERE id = ? AND user_id = ?",
      [roadmapId, userId]
    );

    await pool.query(
      "UPDATE users SET roadmaps_completed = roadmaps_completed + 1 WHERE id = ?",
      [userId]
    );

    console.log("✅ Roadmap marked as completed, counter incremented");

    return res.json({ ok: true });
  } catch (err) {
    console.error("❌ PUT /api/roadmaps/:id/complete error:", err.message);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

/**
 * GET /api/dreams/:dreamId/roadmap
 * Return levels + tasks for one dream
 */
router.get("/dreams/:dreamId/roadmap", async (req, res) => {
  try {
    const dreamId = req.params.dreamId;

    const [levelRows] = await pool.query(
      "SELECT id, name, level_index FROM levels WHERE dream_id = ? ORDER BY level_index ASC",
      [dreamId]
    );

    const levelIds = levelRows.map((l) => l.id);
    let tasksByLevel = {};

    if (levelIds.length > 0) {
      const [taskRows] = await pool.query(
        "SELECT id, level_id, title, description, done, task_index FROM tasks WHERE level_id IN (?) ORDER BY task_index ASC",
        [levelIds]
      );

      tasksByLevel = taskRows.reduce((acc, row) => {
        if (!acc[row.level_id]) acc[row.level_id] = [];
        acc[row.level_id].push({
          id: row.id,
          title: row.title,
          description: row.description,
          done: !!row.done,
          taskIndex: row.task_index,
        });
        return acc;
      }, {});
    }

    const levels = levelRows.map((lvl) => ({
      id: lvl.id,
      name: lvl.name,
      levelIndex: lvl.level_index,
      tasks: tasksByLevel[lvl.id] || [],
    }));

    return res.json({ ok: true, levels });
  } catch (err) {
    console.error("GET /api/dreams/:dreamId/roadmap error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

/**
 * PATCH /api/tasks/:id
 * Update a single task done state and update dream progress
 */
router.patch("/tasks/:id", async (req, res) => {
  const taskId = req.params.id;
  const { done } = req.body;

  if (typeof done !== "boolean") {
    return res
      .status(400)
      .json({ ok: false, error: "done must be boolean" });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1) Update this task
    await conn.query("UPDATE tasks SET done = ? WHERE id = ?", [
      done ? 1 : 0,
      taskId,
    ]);

    // 2) Get dream_id for this task
    const [[taskRow]] = await conn.query(
      `SELECT l.dream_id
       FROM tasks t
       JOIN levels l ON t.level_id = l.id
       WHERE t.id = ?`,
      [taskId]
    );

    if (!taskRow) {
      await conn.rollback();
      return res
        .status(404)
        .json({ ok: false, error: "Task not found" });
    }

    const dreamId = taskRow.dream_id;

    // 3) Recalculate progress for that dream
    const [[counts]] = await conn.query(
      `SELECT 
         COUNT(*) AS totalTasks,
         SUM(CASE WHEN done = 1 THEN 1 ELSE 0 END) AS doneTasks
       FROM tasks
       JOIN levels ON tasks.level_id = levels.id
       WHERE levels.dream_id = ?`,
      [dreamId]
    );

    const total = counts.totalTasks || 0;
    const doneCount = counts.doneTasks || 0;
    const progress =
      total === 0 ? 0 : Math.round((doneCount / total) * 100);

    await conn.query(
      "UPDATE dreams SET progress = ? WHERE id = ?",
      [progress, dreamId]
    );

    await conn.commit();

    return res.json({ ok: true, progress });
  } catch (err) {
    await conn.rollback();
    console.error("PATCH /api/tasks/:id error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  } finally {
    conn.release();
  }
});

/**
 * PATCH /api/tasks/:id/title
 */
router.patch("/tasks/:id/title", async (req, res) => {
  const taskId = req.params.id;
  const { title } = req.body;

  if (!title || !title.trim()) {
    return res
      .status(400)
      .json({ ok: false, error: "title is required" });
  }

  try {
    await pool.query(
      "UPDATE tasks SET title = ? WHERE id = ?",
      [title.trim(), taskId]
    );

    return res.json({ ok: true });
  } catch (err) {
    console.error("PATCH /tasks/:id/title error:", err);
    return res
      .status(500)
      .json({ ok: false, error: "Server error" });
  }
});

/**
 * DELETE /api/tasks/:id
 */
router.delete("/tasks/:id", async (req, res) => {
  const taskId = req.params.id;

  try {
    const [result] = await pool.query(
      "DELETE FROM tasks WHERE id = ?",
      [taskId]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ ok: false, error: "Task not found" });
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error("DELETE /tasks/:id error:", err);
    return res
      .status(500)
      .json({ ok: false, error: "Server error" });
  }
});

module.exports = router;
