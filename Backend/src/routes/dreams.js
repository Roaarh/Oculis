// backend/src/routes/dreamRoutes.js
const express = require("express");
const pool = require("../config/db");

const router = express.Router();

// GET /api/dreams?userId=...
router.get("/", async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ ok: false, error: "userId is required" });
    }

    const [rows] = await pool.query(
      `SELECT 
         id,
         dream_text,
         created_at
       FROM dreams
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    // Map DB rows to frontend shape
    const dreams = rows.map((row) => ({
      id: row.id,
      title: row.dream_text,
      short: row.dream_text.length > 80 
        ? row.dream_text.slice(0, 77) + "..." 
        : row.dream_text,
      createdAt: row.created_at,
      progress: 0, // later: compute from roadmap/tasks
    }));

    return res.json({ ok: true, dreams });
  } catch (err) {
    console.error("GET /api/dreams error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

module.exports = router;
