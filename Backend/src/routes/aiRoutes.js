// backend/routes/aiRoutes.js
const express = require("express");
const pool = require("../config/db");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL_NAME = "gemini-2.5-flash"; // good for free tier

router.post("/ai/generate-roadmap", async (req, res) => {
  try {
    const { dreamText, userId, dreamId } = req.body;
    console.log("🤖 /ai/generate-roadmap body:", { dreamText, userId, dreamId });

    if (!userId || !dreamId || !dreamText) {
      return res
        .status(400)
        .json({ ok: false, error: "userId, dreamId, dreamText required" });
    }

    // 1) Load user profile
    const [[profile]] = await pool.query(
      `SELECT area, time_per_week, work_status, experience, horizon, pace, constraints, motivation
       FROM user_profiles
       WHERE user_id = ?`,
      [userId]
    );

    console.log("📋 Loaded profile:", profile);

    // 2) Build prompt and call Gemini
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `
You are a professional habit-building coach and roadmap designer.
You create practical, motivating roadmaps that help people change their life step by step.

User dream: "${dreamText}"

User profile:
- Area of focus: ${profile?.area || "unspecified"}
- Time per week: ${profile?.time_per_week || "unspecified"}
- Work status: ${profile?.work_status || "unspecified"}
- Experience level: ${profile?.experience || "unspecified"}
- Time horizon: ${profile?.horizon || "unspecified"}
- Preferred pace: ${profile?.pace || "unspecified"}
- Constraints: ${profile?.constraints || "none"}
- Motivation: ${profile?.motivation || "unspecified"}

STYLE & TONE
- Write in simple, friendly, motivating language.
- Imagine the user is tired after a long day. Tasks must feel light, doable, and encouraging.
- Level 1 must be VERY easy and give a quick win so the user feels productive and happy to continue.
- Avoid corporate or academic tone. No essays.

TASK DESIGN
- Every task must be a specific action, not a vague idea.
- Each task should be something the user can do in 20–60 minutes.
- Mix different types of tasks:
  - Reading books or book summaries about the goal.
  - Watching short tutorials.
  - Practicing the skill in small sessions.
  - Preparing environment or tools.

- EXAMPLES (adapt to the user’s dream):
  - "Read 5–10 pages from a beginner book about [topic] and write 3 bullet notes."
  - "Search online for 3 recommended books about [topic] and choose one to start this week."
  - "Read a summary of a well-known book or concept in this area and write down 3 ideas you like."
  - "Practice [skill] for 15–20 minutes (for example: write Chinese characters, code a small component, do a small exercise)."
  - "Prepare your environment: organize your desk, choose one main book for this goal, and set a daily reading time."

- Use verbs at the start: "Read, Watch, Practice, Write, Plan, Prepare, Review, Improve, Organize".

OUTPUT FORMAT
Generate a JSON object ONLY, no explanations.
It MUST have this exact shape:

{
  "roadmapTitle": "string",
  "levels": [
    {
      "levelNumber": 1,
      "title": "string",
      "description": "short friendly description (3 sentences, max 45 words)",
      "tasks": [
        {
          "label": "short task title (max 8 words, start with a verb)",
          "description": "one simple, concrete action the user can do now (max 30 words)",
          "priority": "high" | "medium" | "low"
        }
      ]
    }
  ]
}

RULES
- Exactly 17 levels (levelNumber 1 to 17).
- Each level must have 2 to 4 tasks.
- At least one task in every 2–3 levels should involve reading from a book, book summary, or article related to the goal.
- Use the user profile to adapt:
  - If time_per_week is low, keep tasks small.
  - If experience is beginner, use more basic tasks.
  - If constraints exist, avoid heavy or expensive tasks.
- Language must be easy to read for an intermediate English learner.
- Do NOT include backticks or markdown, only raw JSON.
`;


    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    console.log("🧠 Raw Gemini text:", text);

    // 3) Parse AI JSON
    let roadmapData;
    try {
      const cleaned = text
        .replace(/^```json/i, "")
        .replace(/^```/, "")
        .replace(/```$/, "")
        .trim();
      roadmapData = JSON.parse(cleaned);
    } catch (e) {
      console.error("❌ Failed to parse Gemini JSON:", e);
      return res
        .status(500)
        .json({ ok: false, error: "AI returned invalid JSON" });
    }

    if (!roadmapData.levels || !Array.isArray(roadmapData.levels)) {
      return res
        .status(500)
        .json({ ok: false, error: "AI JSON missing levels array" });
    }

    // 4) Save to roadmaps
    const [roadmapResult] = await pool.query(
      `INSERT INTO roadmaps (user_id, dream_id, title, description, content)
       VALUES (?, ?, ?, ?, ?)`,
      [
        userId,
        dreamId,
        roadmapData.roadmapTitle || "Untitled Roadmap",
        "AI-generated roadmap for your dream",
        JSON.stringify(roadmapData),
      ]
    );
    const roadmapId = roadmapResult.insertId;
    console.log("✅ Roadmap row inserted:", roadmapId);

    // 5) Save levels + tasks
    for (let i = 0; i < roadmapData.levels.length; i++) {
      const lvl = roadmapData.levels[i];

      const [levelResult] = await pool.query(
        `INSERT INTO levels (dream_id, name, level_index)
         VALUES (?, ?, ?)`,
        [dreamId, lvl.title || `Level ${i + 1}`, i + 1]
      );
      const levelId = levelResult.insertId;

      if (Array.isArray(lvl.tasks)) {
        for (let j = 0; j < lvl.tasks.length; j++) {
          const task = lvl.tasks[j];
          await pool.query(
            `INSERT INTO tasks (level_id, title, description, done, task_index)
             VALUES (?, ?, ?, 0, ?)`,
            [
              levelId,
              task.label || `Task ${j + 1}`,
              task.description || null,
              j + 1,
            ]
          );
        }
      }
    }

    return res.status(201).json({
      ok: true,
      roadmapId,
      dreamId,
    });
  } catch (err) {
    console.error("❌ /ai/generate-roadmap error:", err);
    return res
      .status(500)
      .json({ ok: false, error: "Failed to generate roadmap" });
  }
});

module.exports = router;
