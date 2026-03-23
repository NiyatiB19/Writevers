import axios from "axios";
import gTTS from "gtts";
import path from "path";
import translateText from "../utils/translate.js";
import { translateHtml } from "../utils/translate.js";

// 🔹 TEXT TRANSLATION
export const translateTextController = async (req, res) => {
  try {
    const { text, targetLang } = req.body;

    // Check if the text contains HTML tags
    const isHtml = /<[^>]*>/.test(text);

    let translated;
    if (isHtml) {
      translated = await translateHtml(text, targetLang);
    } else {
      translated = await translateText(text, targetLang);
    }

    res.json({
      original: text,
      translated: translated
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
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