// backend/src/routes/userProfile.js
const express = require("express");
const pool = require("../config/db");
const router = express.Router();

router.post("/profile", async (req, res) => {
  try {
    const { 
      userId, 
      area, 
      timePerWeek, 
      workStatus, 
      experience, 
      horizon, 
      pace, 
      constraints, 
      motivation
    } = req.body;

    console.log("POST /api/user/profile:", { userId, area, horizon, pace });

    // UPSERT into user_profiles (NO avatar)
    const [result] = await pool.query(
      `INSERT INTO user_profiles 
       (user_id, area, time_per_week, work_status, experience, horizon, pace, constraints, motivation) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE 
       area = VALUES(area),
       time_per_week = VALUES(time_per_week),
       work_status = VALUES(work_status),
       experience = VALUES(experience),
       horizon = VALUES(horizon),
       pace = VALUES(pace),
       constraints = VALUES(constraints),
       motivation = VALUES(motivation),
       updated_at = CURRENT_TIMESTAMP`,
      [
        userId,
        area || null,
        timePerWeek || null,
        workStatus || null,
        experience || null,
        horizon || null,
        pace || null,
        constraints || null,
        motivation || null
      ]
    );

    console.log("✅ Profile saved for userId:", userId);

    res.json({ 
      ok: true, 
      message: "Profile saved successfully",
      userId: parseInt(userId)
    });
  } catch (err) {
    console.error("POST /api/user/profile ERROR:", err);
    res.status(500).json({ 
      ok: false, 
      error: "Server error: " + err.message 
    });
  }
});

module.exports = router;
