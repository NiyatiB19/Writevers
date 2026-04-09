export async function translateText(text, targetLang) {
  try {
    const cleanText = (text || "").replace(/<[^>]*>/g, "").trim();
    if (!cleanText) return "";

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t`;
    // For POST, google requires application/x-www-form-urlencoded
    const params = new URLSearchParams();
    params.append('q', text); // use text instead of cleanText if we are relying on frontend stripping
    
    const response = await fetch(url, {
      method: "POST",
      body: params
    });
    
    if (!response.ok) throw new Error("Google Translate API error");
    
    const data = await response.json();
    
    let translatedText = '';
    data[0].forEach(item => {
      if (item[0]) translatedText += item[0];
    });
    return translatedText;
  } catch (e) {
    console.error("Translation failed:", e.message);
    throw new Error("Translation failed");
  }
}

async function test() {
    const res = await translateText("Hello world!\n\nThis is a test.", "fr");
    console.log(res);
}
test();
