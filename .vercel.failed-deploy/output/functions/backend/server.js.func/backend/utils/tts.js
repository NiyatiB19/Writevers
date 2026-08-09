import gTTS from "gtts";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const textToAudio = (text, language) => {
  return new Promise((resolve, reject) => {
    // gTTS expects 'en', 'hi', not 'en-US'
    const baseLang = language.split('-')[0].toLowerCase();
    
    const filePath = path.join(__dirname, `../output_${Date.now()}_${Math.floor(Math.random()*1000)}.mp3`);

    const gtts = new gTTS(text, baseLang);

    gtts.save(filePath, function (err) {
      if (err) reject(err);
      else resolve(filePath);
    });
  });
};

export default textToAudio;