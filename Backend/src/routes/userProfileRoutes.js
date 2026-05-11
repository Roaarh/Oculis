// GET /api/user/stats?userId=...
router.get("/stats", async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res
        .status(400)
        .json({ ok: false, error: "userId is required" });
    }

    // Count dreams created by this user
    const [dreamRows] = await pool.execute(
      "SELECT COUNT(*) as count FROM dreams WHERE user_id = ?",
      [userId]
    );
    const dreamsCount = dreamRows[0]?.count || 0;

    // Count roadmaps completed by this user
    const [roadmapRows] = await pool.execute(
      "SELECT COUNT(*) as count FROM roadmaps WHERE user_id = ? AND completed_at IS NOT NULL",
      [userId]
    );
    const roamapsCompleted = roadmapRows[0]?.count || 0;

    return res.json({
      ok: true,
      stats: {
        dreamsCreated: dreamsCount,
        roadmapsCompleted: roamapsCompleted,
      },
    });
  } catch (err) {
    console.error("Stats fetch error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});
