import "../server/loadEnv.js";
import express from "express";
import authRoutes from "../server/routes/auth.js";
import resumeRoutes from "../server/routes/resume.js";
import interviewRoutes from "../server/routes/interview.js";
import mentorRoutes from "../server/routes/mentor.js";
import dsaRoutes from "../server/routes/dsa.js";
import jobsRoutes from "../server/routes/jobs.js";
import userRoutes from "../server/routes/user.js";

const app = express();

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    service: "NexHire Core Platform API",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "production"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/mentor", mentorRoutes);
app.use("/api/dsa", dsaRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/user", userRoutes);

export default app;
