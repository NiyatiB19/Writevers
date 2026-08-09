import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import homeRoutes from "./routes/homeRoutes.js";
import translateRoutes from "./routes/translateRoutes.js";
import ttsRoutes from "./routes/ttsRoutes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || true,
  credentials: true
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/api", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(503).json({
      message: "Database connection failed",
      error: error.message
    });
  }
});

app.use("/api/home", homeRoutes);
app.use("/api/translate", translateRoutes);
app.use("/api/tts", ttsRoutes);

const PORT = process.env.PORT || 5001;
if (!process.env.VERCEL) {
  connectDB().catch(() => {});
  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
}

export default app;
