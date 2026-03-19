/*import express from "express";
import translateText from "../utils/translate.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { text, lang } = req.body;

  if (!text || !lang) {
    return res.status(400).json({ error: "Text and language are required" });
  }

  try {
    const translated = await translateText(text, lang);
    res.json({ translated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Translation failed" });
  }
});

export default router;
*/
import express from "express";
import translateText from "../utils/translate.js";
import textToAudio from "../utils/tts.js";
import path from "path";
import fs from "fs";

const router = express.Router();

// 🔹 TRANSLATION ROUTE
router.post("/", async (req, res) => {
  const { text, targetLang } = req.body;

  if (!text || !targetLang) {
    return res.status(400).json({ error: "Text and target language are required" });
  }

  try {
    const translatedText = await translateText(text, targetLang);
    res.json({ translatedText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Translation failed" });
  }
});

export default router;