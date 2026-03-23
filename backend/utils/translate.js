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
import * as cheerio from "cheerio";

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

// Function to translate HTML content while preserving structure
const translateHtml = async (html, targetLang) => {
  try {
    // Load HTML into cheerio
    const $ = cheerio.load(html, { decodeEntities: false });

    // Function to recursively translate text nodes
    const translateTextNodes = async (element) => {
      const children = $(element).contents();

      for (let i = 0; i < children.length; i++) {
        const child = children[i];

        if (child.type === 'text') {
          // Only translate non-empty text nodes
          const text = $(child).text().trim();
          if (text) {
            try {
              const translated = await translateText(text, targetLang);
              $(child).replaceWith(translated);
            } catch (error) {
              console.error('Error translating text node:', error);
              // Keep original text if translation fails
            }
          }
        } else if (child.type === 'tag') {
          // Skip certain tags that shouldn't have their content translated
          const tagName = child.tagName.toLowerCase();
          const skipTags = ['script', 'style', 'code', 'pre'];

          if (!skipTags.includes(tagName)) {
            // Recursively process child elements
            await translateTextNodes(child);
          }
        }
        // Comment and other node types are left as-is
      }
    };

    // Start translation from the root element
    await translateTextNodes($.root());

    // Return the HTML content without the added html/head/body wrapper
    return $('body').html() || $.html();
  } catch (error) {
    console.error("HTML Translation Error:", error);
    throw new Error("HTML translation failed");
  }
};

export { translateHtml };
export default translateText;