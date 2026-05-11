// backend/server.js (or index.js)
require("dotenv").config();

process.on("uncaughtException", (err) => {
  console.error("UNCaught exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("UNhandled rejection:", reason);
});

const express = require("express");
const cors = require("cors");

// Import the pool from config (kept if you need it somewhere here)
const pool = require("./config/db");

const welcomeRoutes = require("./routes/welcome");
const authRoutes = require("./routes/auth");
const userProfileRoutes = require("./routes/userProfile");
const userAccountRoutes = require("./routes/userAccount");
const userSettingsRouter = require("./routes/userSettings");
const dreamRoutes = require("./routes/dreamRoutes");
const aiRoutes = require("./routes/aiRoutes");
const roadmapRoutes = require("./routes/roadmapRoutes");
const adminRoutes = require("./routes/admin");
const chatRoutes = require("./routes/chatRoutes");



const app = express();
const PORT = process.env.PORT || 4000;

// CORS for your Vite frontend
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: false,
  })
);

// Allow larger JSON bodies (for avatar base64)
app.use(express.json({ limit: "2mb" })); 
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Health checks
app.get("/", (req, res) => {
  res.json({ message: "Oculis backend is running" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is healthy" });
});

// Welcome-related routes
app.use("/api/welcome", welcomeRoutes);

// Auth routes
app.use("/api/auth", authRoutes);

// User profile (onboarding) routes
app.use("/api/user", userProfileRoutes);

// User account (username, bio, avatar) routes
app.use("/api/user", userAccountRoutes);

// User settings routes
app.use("/api/user", userSettingsRouter);

// Dream routes mounted at /api/dreams
// Inside dreamRoutes you have: router.post("/") and router.get("/")
app.use("/api/dreams", dreamRoutes);

// AI routes (includes POST /ai/generate-roadmap)
app.use("/api", aiRoutes);
app.use("/api", chatRoutes);
// Roadmap-related routes
// Inside roadmapRoutes you have:
//  POST /roadmaps
//  PUT  /roadmaps/:id/complete
//  GET  /dreams/:dreamId/roadmap
//  PATCH/DELETE /tasks/:id etc.
app.use("/api", roadmapRoutes);

// Admin routes
app.use("/api/admin", adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend listening on http://localhost:${PORT}`);
});
