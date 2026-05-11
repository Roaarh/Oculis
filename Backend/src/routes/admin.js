const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "oculis-dev-secret";

// POST /api/admin/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const [admins] = await pool.query(
      "SELECT id, username, email, password, is_active FROM admin_users WHERE email = ?",
      [email]
    );

    if (admins.length === 0) {
      return res.status(401).json({ ok: false, error: "Invalid credentials" });
    }

    const admin = admins[0];
    if (!admin.is_active) {
      return res.status(403).json({ ok: false, error: "Account deactivated" });
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return res.status(401).json({ ok: false, error: "Invalid credentials" });
    }

    const token = jwt.sign({ adminId: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      ok: true,
      token,
      admin: { id: admin.id, username: admin.username, email: admin.email },
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

// GET /api/admin/users - MATCHES YOUR TABLE EXACTLY
router.get("/users", async (req, res) => {
  try {
    console.log("📊 Fetching USERS (your table structure)...");
    
    // YOUR EXACT table columns
    const [users] = await pool.query(`
      SELECT 
        id,
        username AS name,
        email,
        CASE 
          WHEN dreams_created > 0 OR roadmaps_completed > 0 THEN 'Active' 
          ELSE 'Deactivated' 
        END AS status
      FROM users 
      ORDER BY created_at DESC
    `);
    
    // Add dreams count from your table
    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name || user.username || "N/A",
      email: user.email || "N/A",
      status: user.status,
      dreams: user.dreams_created || 0
    }));
    
    console.log(`✅ USERS LOADED: ${formattedUsers.length} users`);
    console.log("First user:", formattedUsers[0]);
    
    res.json(formattedUsers);
    
  } catch (err) {
    console.error("🚨 USERS ERROR:", err.message);
    res.json([]);  // Safe fallback
  }
});

// GET /api/admin/stats - ULTRA SAFE
router.get("/stats", async (req, res) => {
  try {
    console.log("📈 Fetching STATS...");
    
    const stats = { totalUsers: 0, totalDreams: 0, activeRoadmaps: 0, completedTasks: 0 };
    
    // Try each query independently
    try {
      const [result] = await pool.query("SELECT COUNT(*) as count FROM users");
      stats.totalUsers = parseInt(result[0].count);
    } catch (e) {
      console.warn("⚠️ users table missing:", e.message);
    }
    
    try {
      const [result] = await pool.query("SELECT COUNT(*) as count FROM dreams");
      stats.totalDreams = parseInt(result[0].count);
    } catch (e) {
      console.warn("⚠️ dreams table missing:", e.message);
    }
    
    console.log("✅ STATS:", stats);
    res.json(stats);
  } catch (err) {
    console.error("🚨 STATS ERROR:", err.message);
    res.json({ totalUsers: 0, totalDreams: 0, activeRoadmaps: 0, completedTasks: 0 });
  }
});

module.exports = router;
