/*import axios from "axios";

const translateText = async (text, targetLang) => {
  try {
    const response = await axios.post(
      "https://translate.argosopentech.com/translate",
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

    return response.data.translatedText;

  } catch (error) {
    console.error("Translation API Error:", error.response?.data || error.message);
    throw new Error("Translation API failed");
  }
};

export default translateText;
*/
import * as translateApi from "google-translate-api-x";

const translateText = async (text, targetLang) => {
  try {
    if (text.length < 4000) {
      const result = await translateApi.default(text, { to: targetLang });
      return result.text;
    }

    const chunks = [];
    let currentChunk = "";
    const parts = text.split(/(<\/p>|<br>|<br\/>|\n)/g);

    for (let part of parts) {
      if (currentChunk.length + part.length > 4000) {
        chunks.push(currentChunk);
        currentChunk = part;
      } else {
        currentChunk += part;
      }
    }
    if (currentChunk) chunks.push(currentChunk);

    let translatedChunks = [];
    for (let chunk of chunks) {
      if (!chunk.trim()) {
        translatedChunks.push(chunk);
        continue;
      }
      const result = await translateApi.default(chunk, { to: targetLang });
      translatedChunks.push(result.text);
    }
    
    return translatedChunks.join("");
  } catch (error) {
    console.error("Translation Error:", error);
    throw new Error("Translation failed");
  }
};

export default translateText;