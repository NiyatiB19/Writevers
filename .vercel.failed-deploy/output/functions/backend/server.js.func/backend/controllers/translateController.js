import axios from "axios";
import gTTS from "gtts";
import path from "path";
import translateText from "../utils/translate.js";

// 🔹 TEXT TRANSLATION
export const translateTextController = async (req, res) => {
  try {
    const { text, targetLang } = req.body;

    if (!text || !targetLang) {
      return res.status(400).json({ error: "Text and target language are required" });
    }

    const translatedText = await translateText(text, targetLang);

    return res.json({
      translatedText: translatedText
    });

  } catch (error) {
    console.error("translateTextController error:", error);
    res.status(500).json({ error: error.message || "Translation failed" });
  }
};

// 🔹 TEXT TO SPEECH
export const textToAudio = async (req, res) => {
  try {
    const { text, language } = req.body;

    const gtts = new gTTS(text, language);
    const filePath = path.join(process.cwd(), "output.mp3");

    gtts.save(filePath, function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.sendFile(filePath);
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};