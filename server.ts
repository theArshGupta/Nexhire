import "./server/loadEnv.js";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

import authRoutes from "./server/routes/auth.js";
import resumeRoutes from "./server/routes/resume.js";
import interviewRoutes from "./server/routes/interview.js";
import mentorRoutes from "./server/routes/mentor.js";
import dsaRoutes from "./server/routes/dsa.js";
import jobsRoutes from "./server/routes/jobs.js";
import userRoutes from "./server/routes/user.js";

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.set("trust proxy", 1);

  // Global Middlewares
  app.use(express.json({ limit: "25mb" }));
  app.use(express.urlencoded({ extended: true, limit: "25mb" }));

  // CORS Headers
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "online",
      service: "NexHire Core Platform API",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development"
    });
  });

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/resume", resumeRoutes);
  app.use("/api/interview", interviewRoutes);
  app.use("/api/mentor", mentorRoutes);
  app.use("/api/dsa", dsaRoutes);
  app.use("/api/jobs", jobsRoutes);
  app.use("/api/user", userRoutes);

  // Never let the SPA handle unmatched API routes (would break OAuth redirects)
  app.use("/api", (_req, res) => {
    res.status(404).json({ error: "API endpoint not found" });
  });

  // Vite Middleware for Development / Static serving for Production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`NexHire Backend Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
