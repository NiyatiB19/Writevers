import express from "express";
import textToAudio from "../utils/tts.js";
import path from "path";
import fs from "fs";

const router = express.Router();

router.post("/", async (req, res) => {
  const { text, lang } = req.body;

  if (!text || !lang) {
    return res.status(400).json({ error: "Text and language are required" });
  }

  try {
    const filePath = await textToAudio(text, lang);
    res.sendFile(path.resolve(filePath), (err) => {
        if (!err) {
            fs.unlink(filePath, () => {});
        }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "TTS failed" });
  }
});

export default router;
