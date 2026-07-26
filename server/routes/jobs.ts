import { Router, Request, Response } from "express";
import { db } from "../db";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();

// GET /api/jobs
router.get("/", (req: Request, res: Response) => {
  try {
    const jobs = [
      {
        id: "job_1",
        company: "Google",
        role: "Software Engineer, University Grad",
        location: "Mountain View, CA / Remote",
        matchScore: 94,
        salary: "$140,000 - $185,000",
        tags: ["Distributed Systems", "C++", "Go", "Algorithms"],
        logo: "🔍",
        postedDate: "2 days ago"
      },
      {
        id: "job_2",
        company: "Meta",
        role: "Frontend Engineer (L4)",
        location: "Menlo Park, CA / Remote",
        matchScore: 91,
        salary: "$135,000 - $175,000",
        tags: ["React", "TypeScript", "GraphQL", "Performance"],
        logo: "♾️",
        postedDate: "1 day ago"
      },
      {
        id: "job_3",
        company: "Amazon",
        role: "SDE I - AWS Cloud Services",
        location: "Seattle, WA / Hybrid",
        matchScore: 89,
        salary: "$130,000 - $165,000",
        tags: ["AWS", "Java", "System Architecture", "Microservices"],
        logo: "📦",
        postedDate: "3 days ago"
      },
      {
        id: "job_4",
        company: "Microsoft",
        role: "Software Engineer - Azure Compute",
        location: "Redmond, WA",
        matchScore: 96,
        salary: "$138,000 - $180,000",
        tags: ["C#", ".NET Core", "Distributed Systems", "Kubernetes"],
        logo: "🪟",
        postedDate: "Just now"
      }
    ];

    res.json({ success: true, jobs });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch jobs" });
  }
});

// GET /api/jobs/applications
router.get("/applications", authenticate, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user!.id;
    const applications = await db.getApplications(userId);
    res.json({ success: true, applications });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch applications" });
  }
});

// POST /api/jobs/applications
router.post("/applications", authenticate, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user!.id;
    const { companyName, role, status, matchScore, logo } = req.body;
    if (!companyName || !role) {
      return res.status(400).json({ error: "companyName and role are required" });
    }

    const application = await db.addApplication({
      userId,
      companyName,
      role,
      status: status || "Applied",
      matchScore: matchScore || 88,
      appliedDate: new Date().toISOString().split("T")[0],
      logo: logo || "💼"
    });

    res.json({ success: true, application });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to create application" });
  }
});

export default router;
