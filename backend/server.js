import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import homeRoutes from "./routes/homeRoutes.js";
import translateRoutes from "./routes/translateRoutes.js";
import ttsRoutes from "./routes/ttsRoutes.js";

dotenv.config();
connectDB();

const app = express();



app.use(cors({
  origin: ["http://localhost:3000"],
  credentials: true
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/api/home", homeRoutes);
app.use("/api/translate", translateRoutes);
app.use("/api/tts", ttsRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
