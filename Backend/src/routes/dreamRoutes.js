// backend/src/routes/dreamRoutes.js
const express = require("express");
const pool = require("../config/db"); // same as your "db"

const router = express.Router();

/**
 * POST /api/dreams
 * Creates a new dream for a user (used by DreamInput)
 */
router.post("/", async (req, res) => {
  try {
    const { userId, dreamText } = req.body;

    console.log("📥 /api/dreams body:", req.body);

    if (!userId || !dreamText || !dreamText.trim()) {
      console.log("⚠️ Validation failed");
      return res.status(400).json({
        ok: false,
        error: "userId and dreamText are required",
      });
    }

    const trimmed = dreamText.trim();
    const sql = "INSERT INTO dreams (user_id, dream_text) VALUES (?, ?)";

    console.log("📝 Inserting dream for userId:", userId);

    // Insert dream
    const [result] = await pool.query(sql, [userId, trimmed]);

    console.log("✅ Dream inserted with id:", result.insertId);

    // Increment dreams_created counter in users table
    await pool.query(
      "UPDATE users SET dreams_created = dreams_created + 1 WHERE id = ?",
      [userId]
    );

    console.log("✅ Incremented dreams_created counter for user:", userId);

    return res.status(201).json({
      ok: true,
      dreamId: result.insertId,
    });
  } catch (err) {
    console.error("❌ POST /api/dreams error:", err.message);
    return res.status(500).json({
      ok: false,
      error: "Failed to create dream: " + err.message,
    });
  }
});

/**
 * GET /api/dreams?userId=...
 * Returns all dreams for a user (used by My Dreams page)
 */
router.get("/", async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res
        .status(400)
        .json({ ok: false, error: "userId is required" });
    }

    const [rows] = await pool.query(
      `SELECT 
         id,
         dream_text,
         created_at,
         progress         -- ⬅️ include progress from DB
       FROM dreams
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    const dreams = rows.map((row) => ({
      id: row.id,
      title: row.dream_text,
      short:
        row.dream_text.length > 80
          ? row.dream_text.slice(0, 77) + "..."
          : row.dream_text,
      createdAt: row.created_at,
      progress: row.progress ?? 0,   // ⬅️ use DB value
    }));

    return res.json({ ok: true, dreams });
  } catch (err) {
    console.error("GET /api/dreams error:", err);
    return res
      .status(500)
      .json({ ok: false, error: "Server error" });
  }
});

// PUT /api/dreams/:id/progress
router.put("/:id/progress", async (req, res) => {
  try {
    const dreamId = req.params.id;
    const { progress } = req.body;

    if (!dreamId || typeof progress !== "number") {
      return res.status(400).json({ ok: false, error: "dreamId and numeric progress are required" });
    }

    const clamped = Math.max(0, Math.min(100, Math.round(progress)));

    await pool.query(
      "UPDATE dreams SET progress = ? WHERE id = ?",
      [clamped, dreamId]
    );

    return res.json({ ok: true, progress: clamped });
  } catch (err) {
    console.error("PUT /api/dreams/:id/progress error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});


module.exports = router;
