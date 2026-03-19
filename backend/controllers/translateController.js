const axios = require("axios");
const gTTS = require("gtts");
const path = require("path");

// 🔹 TEXT TRANSLATION
exports.translateText = async (req, res) => {
  try {
    const { text, targetLang } = req.body;

    const response = await axios.post(
      "https://libretranslate.de/translate",
      {
        q: text,
        source: "en",
        target: targetLang,
        format: "text"
      },
      {
        headers: { "Content-Type": "application/json" }
      }
    );

    res.json({
      original: text,
      translated: response.data.translatedText
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 TEXT TO SPEECH
exports.textToAudio = async (req, res) => {
  try {
    const { text, language } = req.body;

    const gtts = new gTTS(text, language);
    const filePath = path.join(__dirname, "../output.mp3");

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