const express = require("express");
const pool = require("../config/db");

const router = express.Router();

// GET /api/user/settings?userId=...
router.get("/settings", async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ ok: false, error: "userId is required" });
    }

    const [rows] = await pool.execute(
      "SELECT id, theme FROM users WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.json({ ok: true, settings: null });
    }

    return res.json({ ok: true, settings: rows[0] });
  } catch (err) {
    console.error("Settings fetch error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

// PUT /api/user/settings - Update theme
router.put("/settings", async (req, res) => {
  try {
    const { userId, theme } = req.body;

    if (!userId) {
      return res.status(400).json({ ok: false, error: "userId is required" });
    }

    if (!theme) {
      return res.status(400).json({ ok: false, error: "theme is required" });
    }

    console.log("🎨 Updating theme for userId:", userId, "to:", theme);

    const result = await pool.execute(
      "UPDATE users SET theme = ? WHERE id = ?",
      [theme, userId]
    );

    console.log("✅ Theme updated, affected rows:", result[0].affectedRows);

    return res.json({ ok: true });
  } catch (err) {
    console.error("Settings update error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

// DELETE /api/user/account - Delete account
router.delete("/account", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ ok: false, error: "userId is required" });
    }

    console.log("🗑️ Deleting account for userId:", userId);

    const result = await pool.execute("DELETE FROM users WHERE id = ?", [
      userId,
    ]);

    console.log("✅ Account deleted, affected rows:", result[0].affectedRows);

    return res.json({ ok: true });
  } catch (err) {
    console.error("Account deletion error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

module.exports = router;
