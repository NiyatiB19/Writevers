import gTTS from "gtts";
const gtts = new gTTS('નમસ્તે', 'gu');
gtts.save('test.mp3', function (err) {
  if(err) { console.error('Error:', err); }
  else { console.log('Gujarati TTS saved!'); }
});
