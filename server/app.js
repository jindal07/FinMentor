require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mentorRoutes = require("./routes/mentor");
const { initializeAI } = require("./services/aiService");

const app = express();
const PORT = process.env.PORT || 3001;

const ALLOWED_ORIGINS = [
  process.env.CLIENT_URL || "http://localhost:5173",
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.some(o => origin.startsWith(o))) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
}));
app.use(express.json({ limit: "16kb" }));

const requestCounts = new Map();
const RATE_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 60;

app.use("/api/mentor", (req, res, next) => {
  if (req.method !== "POST") return next();

  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const record = requestCounts.get(ip) || { count: 0, windowStart: now };

  if (now - record.windowStart > RATE_WINDOW_MS) {
    record.count = 0;
    record.windowStart = now;
  }

  record.count++;
  requestCounts.set(ip, record);

  if (record.count > MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      error: "Too many requests. Please slow down and try again in a minute.",
    });
  }

  next();
});

initializeAI();

app.use("/api", mentorRoutes);

app.get("/", (_req, res) => {
  res.json({ status: "FinMentor API is running" });
});

app.listen(PORT, () => {
  console.log(`FinMentor server running on http://localhost:${PORT}`);
});
