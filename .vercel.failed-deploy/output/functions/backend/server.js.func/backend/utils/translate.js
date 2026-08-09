import axios from "axios";

const translateText = async (text, targetLang) => {
  try {
    const cleanText = (text || "").replace(/<[^>]*>/g, "").trim();
    if (!cleanText) return "";

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t`;
    // For POST, google requires application/x-www-form-urlencoded
    const params = new URLSearchParams();
    params.append('q', text); // use text to ensure exact match of the frontend array 

    const response = await fetch(url, {
      method: "POST",
      body: params
    });

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.statusText}`);
    }

    const data = await response.json();
    let translatedText = '';
    data[0].forEach(item => {
      if (item[0]) translatedText += item[0];
    });

    return translatedText;

  } catch (error) {
    console.error("Translation API Error:", error);
    throw new Error("Translation failed");
  }
};

export default translateText;