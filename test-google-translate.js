import axios from 'axios';

async function translate(text, target) {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${target}&dt=t`;
    // For POST, google requires application/x-www-form-urlencoded
    const params = new URLSearchParams();
    params.append('q', text);
    
    const response = await axios.post(url, params);
    
    // axios magically parses JSON. The response is an array where the first item is an array of translated segments.
    // [ [["Bonjour", "Hello", ...]], ... ]
    let translatedText = '';
    response.data[0].forEach(item => {
      if (item[0]) translatedText += item[0];
    });
    console.log("Result:", translatedText);
  } catch (e) {
    console.error("Error:", e.message);
  }
}
translate("Hello world!\n\nThis is a test.", "fr");
