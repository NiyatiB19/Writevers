import translateText from './backend/utils/translate.js';

async function test() {
  try {
    const res = await translateText('Hello, world', 'fr');
    console.log('Success:', res);
  } catch (err) {
    console.error('Error:', err);
  }
}
test();
