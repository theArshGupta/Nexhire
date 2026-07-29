import express from "express";

const app = express();

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// CORS headers
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
    environment: process.env.NODE_ENV || "production"
  });
});

// Dynamic resilient loading of Express routers
try {
  const authRoutes = require("../server/routes/auth").default || require("../server/routes/auth");
  app.use("/api/auth", authRoutes);
} catch (err: any) {
  console.error("Failed to load authRoutes:", err?.message);
}

try {
  const resumeRoutes = require("../server/routes/resume").default || require("../server/routes/resume");
  app.use("/api/resume", resumeRoutes);
} catch (err: any) {
  console.error("Failed to load resumeRoutes:", err?.message);
}

try {
  const interviewRoutes = require("../server/routes/interview").default || require("../server/routes/interview");
  app.use("/api/interview", interviewRoutes);
} catch (err: any) {
  console.error("Failed to load interviewRoutes:", err?.message);
}

try {
  const mentorRoutes = require("../server/routes/mentor").default || require("../server/routes/mentor");
  app.use("/api/mentor", mentorRoutes);
} catch (err: any) {
  console.error("Failed to load mentorRoutes:", err?.message);
}

try {
  const dsaRoutes = require("../server/routes/dsa").default || require("../server/routes/dsa");
  app.use("/api/dsa", dsaRoutes);
} catch (err: any) {
  console.error("Failed to load dsaRoutes:", err?.message);
}

try {
  const jobsRoutes = require("../server/routes/jobs").default || require("../server/routes/jobs");
  app.use("/api/jobs", jobsRoutes);
} catch (err: any) {
  console.error("Failed to load jobsRoutes:", err?.message);
}

try {
  const userRoutes = require("../server/routes/user").default || require("../server/routes/user");
  app.use("/api/user", userRoutes);
} catch (err: any) {
  console.error("Failed to load userRoutes:", err?.message);
}

// Global Error Catching Middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Vercel Serverless Error:", err);
  res.status(500).json({
    success: false,
    error: err?.message || "Internal Server Error in Serverless Function"
  });
});

export default app;
