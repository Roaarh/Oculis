const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// POST /api/welcome
// body: { username: string, theme: string }
router.post("/", async (req, res) => {
  const { username, theme } = req.body;

  if (!username || !theme) {
    return res
      .status(400)
      .json({ ok: false, error: "username and theme are required" });
  }

  try {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      // 1) create user
      const [userResult] = await conn.execute(
        "INSERT INTO users (username) VALUES (?)",
        [username]
      );

      const userId = userResult.insertId;

      // 2) create settings row
      await conn.execute(
        "INSERT INTO user_settings (user_id, theme) VALUES (?, ?)",
        [userId, theme]
      );

      await conn.commit();
      conn.release();

      return res.json({
        ok: true,
        user: { id: userId, username },
        settings: { theme },
      });
    } catch (err) {
      await conn.rollback();
      conn.release();
      console.error("DB error in /api/welcome:", err);
      return res.status(500).json({ ok: false, error: "Database error" });
    }
  } catch (err) {
    console.error("Connection error in /api/welcome:", err);
    return res.status(500).json({ ok: false, error: "Connection error" });
  }
});

module.exports = router;
