import { Router, Request, Response } from "express";
import { db } from "../db.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";

const router = Router();

// GET /api/user/profile
router.get("/profile", authenticate, (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    res.json({ success: true, user: authReq.user });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch user profile" });
  }
});

// PUT /api/user/profile
router.put("/profile", authenticate, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const updates = req.body;
    const userId = authReq.user!.id;
    const updatedUser = await db.updateUser(userId, updates);
    res.json({ success: true, user: updatedUser });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update profile" });
  }
});

// GET /api/user/stats
router.get("/stats", authenticate, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user!.id;

    const user = await db.getUserById(userId);
    const applications = await db.getApplications(userId);
    const interviewSessions = await db.getInterviewSessions(userId);

    const isDemo = userId === "usr_demo123";

    res.json({
      success: true,
      stats: {
        resumeScore: user?.resumeScore || 0,
        dsaSolved: user?.dsaSolvedCount || 0,
        interviewsCompleted: interviewSessions.length,
        streakDays: user?.streakDays || 0,
        totalApplications: applications.length,
        offersCount: applications.filter(a => a.status === "Offered").length,
        upcomingInterviewsCount: applications.filter(a => a.status === "Interview").length,
        leaderboardRank: isDemo ? "#12 in Stanford University Cohort" : "Unranked (New Candidate)",
        percentile: isDemo ? "Top 2%" : "N/A"
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch stats" });
  }
});

export default router;
