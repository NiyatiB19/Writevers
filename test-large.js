import translateText from './backend/utils/translate.js';

async function test() {
  const largeText = "Hello world. ".repeat(1000); // 13000 chars
  try {
    const res = await translateText(largeText, 'fr');
    console.log('Success length:', res.length);
  } catch (err) {
    console.error('API Error:', err.message);
  }
}
test();
