// backend/src/routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "oculis-dev-secret";

/**
 * SIGN UP / COMPLETE REGISTRATION
 * POST /api/auth/register
 * body: { username, email, password }
 *
 * Behavior:
 * - If username exists and has no password yet -> UPDATE that row (set email + password_hash).
 * - If username exists and already has password -> error "username already registered".
 * - If username does not exist -> INSERT new user.
 */
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ ok: false, error: "username and password are required" });
  }

  try {
    // Check if this username already exists
    const [rows] = await pool.execute(
      "SELECT id, username, email, password_hash FROM users WHERE username = ?",
      [username]
    );

    const passwordHash = await bcrypt.hash(password, 10);
    let userId;

    if (rows.length > 0) {
      const existing = rows[0];

      // If already has password, it's fully registered
      if (existing.password_hash) {
        return res
          .status(400)
          .json({ ok: false, error: "Username is already registered" });
      }

      // Username exists but no password yet: update this record
      await pool.execute(
        "UPDATE users SET email = ?, password_hash = ? WHERE id = ?",
        [email || existing.email || null, passwordHash, existing.id]
      );
      userId = existing.id;
    } else {
      // Username does not exist: create fresh
      const [result] = await pool.execute(
        "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
        [username, email || null, passwordHash]
      );
      userId = result.insertId;
    }

    const token = jwt.sign({ id: userId, username }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      ok: true,
      token,
      user: { id: userId, username, email: email || null },
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

/**
 * LOGIN
 * POST /api/auth/login
 * body: { username, password }
 *
 * "username" field here can actually be username OR email.
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ ok: false, error: "email and password are required" });
  }

  try {
    const loginIdentifier = email; // could be email OR username

    const [rows] = await pool.execute(
      "SELECT id, username, email, password_hash FROM users WHERE email = ? OR username = ?",
      [loginIdentifier, loginIdentifier]
    );

    if (rows.length === 0) {
      return res
        .status(400)
        .json({ ok: false, error: "Invalid email or password" });
    }

    const user = rows[0];

    const match = await bcrypt.compare(password, user.password_hash || "");
    if (!match) {
      return res
        .status(400)
        .json({ ok: false, error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      ok: true,
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

module.exports = router;