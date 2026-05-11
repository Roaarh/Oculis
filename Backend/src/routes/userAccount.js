// backend/src/routes/userAccount.js
const express = require("express");
const pool = require("../config/db");

const router = express.Router();

// GET /api/user/account?userId=...
router.get("/account", async (req, res) => {
  try {
    const userId = req.query.userId;

    console.log("📡 GET /account for userId:", userId);

    if (!userId) {
      return res
        .status(400)
        .json({ ok: false, error: "userId is required" });
    }

    const [rows] = await pool.execute(
      `SELECT id, username, bio, avatar_url, dreams_created, roadmaps_completed
       FROM users
       WHERE id = ?`,
      [userId]
    );

    console.log("📦 Query result:", rows);

    if (rows.length === 0) {
      console.warn("⚠️ User not found");
      return res.json({
        ok: true,
        account: {
          username: "",
          bio: "",
          avatar_url: null,
          dreams_created: 0,
          roadmaps_completed: 0,
        },
      });
    }

    const user = rows[0];
    console.log("✅ User data loaded:", {
      username: user.username,
      dreams_created: user.dreams_created,
      roadmaps_completed: user.roadmaps_completed,
      hasAvatar: !!user.avatar_url,
    });

    return res.json({
      ok: true,
      account: {
        username: user.username || "",
        bio: user.bio || "",
        avatar_url: user.avatar_url || null,
        dreams_created: user.dreams_created || 0,
        roadmaps_completed: user.roadmaps_completed || 0,
      },
    });
  } catch (err) {
    console.error("❌ Account fetch error:", err.message);
    console.error("❌ Full error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

// PUT /api/user/account
router.put("/account", async (req, res) => {
  try {
    const { userId, username, bio, avatarUrl } = req.body;

    console.log("🔧 PUT /account received:", {
      userId,
      username,
      bio: bio ? bio.substring(0, 50) : null,
      avatarUrl: avatarUrl ? `base64 length: ${avatarUrl.length}` : null,
    });

    if (!userId) {
      return res
        .status(400)
        .json({ ok: false, error: "userId is required" });
    }

    const updates = [];
    const values = [];

    if (username !== undefined && username !== null) {
      console.log("✏️ Updating username to:", username);
      updates.push("username = ?");
      values.push(username.trim());
    }

    if (bio !== undefined && bio !== null) {
      console.log("✏️ Updating bio");
      updates.push("bio = ?");
      values.push(bio);
    }

    if (avatarUrl !== undefined && avatarUrl !== null) {
      console.log("✏️ Updating avatar_url (length:", avatarUrl.length, ")");
      updates.push("avatar_url = ?");
      values.push(avatarUrl);
    }

    if (updates.length === 0) {
      console.log("⚠️ No fields to update");
      return res.json({ ok: true });
    }

    values.push(userId);
    const query = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;
    console.log("🗄️ Executing query:", query);

    const [result] = await pool.execute(query, values);
    console.log("✅ Query result - affectedRows:", result.affectedRows);

    if (result.affectedRows === 0) {
      console.warn("⚠️ No rows were updated - user may not exist");
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error("❌ Account update error:", err.message);
    console.error("❌ Full error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

module.exports = router;
