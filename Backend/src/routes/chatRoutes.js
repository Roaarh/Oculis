// backend/routes/chatRoutes.js
const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const CHAT_MODEL = "gemini-2.5-flash"; // same free model you use now

router.post("/chat", async (req, res) => {
  try {
    const { messages, userId } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res
        .status(400)
        .json({ ok: false, error: "messages array is required" });
    }

    const model = genAI.getGenerativeModel({ model: CHAT_MODEL });

    // messages = [{ role: "user" | "assistant", content: "..." }, ...]
    const systemPrompt = `
You are Oculis, a warm and supportive motivational companion.

GOAL
- Help the user stay consistent with their dreams and roadmap.
- Speak like a friendly, encouraging friend, not a formal therapist or doctor.
- Focus on motivation, habits, mindset, and small next steps.
- Do NOT give medical, mental health, or crisis advice. If the user mentions serious health issues or self-harm, gently tell them to talk to a trusted person or professional.

TONE
- Empathetic, kind, non-judgmental.
- Short answers: 2–5 sentences.
- Acknowledge feelings first, then offer 1–3 simple suggestions.
- Use “you” language, and sometimes “we” to feel like a teammate.
- Avoid sounding like a robot or lecturer.

BEHAVIOR
- When the user feels tired or can’t work:
  - Validate how they feel.
  - Suggest one tiny, realistic step or a rest ritual (e.g. write 1 line, read 1 page, plan tomorrow).
  - Remind them of their progress and that it’s okay to move slowly.
- When the user wants to talk:
  - Ask 1–2 gentle questions to understand what’s going on.
  - Reflect back what they said in your own words so they feel heard.
- Never discuss detailed health treatments, diagnoses, or crisis instructions.
`;

    const historyText = messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n");

    const fullPrompt = `${systemPrompt}\n\n${historyText}\nASSISTANT:`;

    const result = await model.generateContent(fullPrompt);
    const reply = result.response.text().trim();

    return res.json({ ok: true, reply });
  } catch (err) {
    console.error("❌ /api/chat error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

module.exports = router;
