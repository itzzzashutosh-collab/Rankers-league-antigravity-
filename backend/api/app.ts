import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { attachDb } from "../middleware/supabase.js";
import walletRoutes from "../routes/wallet.js";
import registrationRoutes from "../routes/registration.js";
import contestRoutes from "../routes/contests.js";
import profileRoutes from "../routes/profile.js";
import dashboardRoutes from "../routes/dashboard.js";
import notificationRoutes from "../routes/notifications.js";
import leaderboardRoutes from "../routes/leaderboard.js";
import bankAgentRoutes from "../routes/bankAgent.js";
import contestAgentRoutes from "../routes/contestAgent.js";

// Load environment variables
dotenv.config({ path: `${process.cwd()}/.env` });

const app = express();
const port = process.env.BACKEND_PORT || 4000;

// ─── Global Middleware ───────────────────────────────────────────────────────
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    process.env.FRONTEND_URL || "http://localhost:3000"
  ],
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));

// Attach admin Supabase client to every request
app.use(attachDb);

// ─── Health Check ────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "rankers-league-backend",
    version: "2.0.0",
  });
});

// ─── API v1 Routes ───────────────────────────────────────────────────────────
app.use("/api/v1/wallet", walletRoutes);
app.use("/api/v1/registration", registrationRoutes);
app.use("/api/v1/contests", contestRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/leaderboard", leaderboardRoutes);
app.use("/api/v1/bank-agent", bankAgentRoutes);
app.use("/api/v1/contest-agent", contestAgentRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.path} not found on backend.`,
  });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[Backend Error]", err.message);
  res.status(500).json({
    success: false,
    error: err.message || "Internal server error.",
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`\n🚀 Ranker's League Backend running on http://localhost:${port}`);
    console.log(`   Health: http://localhost:${port}/health`);
    console.log(`   API: http://localhost:${port}/api/v1/\n`);
  });
}

export default app;
