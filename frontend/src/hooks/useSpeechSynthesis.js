import { useState, useEffect, useRef } from 'react';

const getBestVoiceForLanguage = (voices, langCode) => {
  if (!voices || voices.length === 0 || !langCode) return null;

  const normalized = langCode.toLowerCase();
  const shortLocale = normalized.split("-")[0];

  // Exact match
  let bestVoice = voices.find(voice => voice.lang?.toLowerCase() === normalized);

  // If not, match base language
  if (!bestVoice) {
    bestVoice = voices.find(voice => voice.lang?.toLowerCase().startsWith(shortLocale));
  }

  // If still not, any voice starting with the base
  if (!bestVoice) {
    bestVoice = voices.find(voice => voice.lang?.toLowerCase().startsWith(shortLocale + "-"));
  }

  // Fallback mapping: Gujarati -> Hindi, French -> English
  const languageFallback = {
    "gu-in": "hi-in",
    "fr-fr": "en-us"
  };

  if (!bestVoice && languageFallback[normalized]) {
    const fallbackLocale = languageFallback[normalized];
    bestVoice = voices.find(voice => voice.lang?.toLowerCase() === fallbackLocale)
      || voices.find(voice => voice.lang?.toLowerCase().startsWith(fallbackLocale.split("-")[0]));
  }

  return bestVoice || null;
};

export const useSpeechSynthesis = () => {
  const [voices, setVoices] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef(null);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = (text, langCode) => {
    return new Promise((resolve, reject) => {
      if (!window.speechSynthesis) {
        reject(new Error("Speech synthesis not supported"));
        return;
      }

      // Stop any current speech immediately
      window.speechSynthesis.cancel();
      stop();

      const normalizedLang = (langCode || "").toLowerCase();
      let bestVoice = null;
      let finalLang = langCode;

      if (langCode === "gu-IN") {
          bestVoice = voices.find(v => v.lang.toLowerCase().replace('_', '-').startsWith("gu"));
          if (!bestVoice) {
              bestVoice = voices.find(v => v.lang.toLowerCase().replace('_', '-').startsWith("hi"));
              finalLang = "hi-IN";
          }
      } else if (langCode === "fr-FR") {
          bestVoice = voices.find(v => v.lang.toLowerCase().replace('_', '-').startsWith("fr"));
          if (!bestVoice) {
              bestVoice = voices.find(v => v.lang.toLowerCase().replace('_', '-').startsWith("en"));
              finalLang = "en-US";
          }
      } else {
          bestVoice = getBestVoiceForLanguage(voices, normalizedLang);
      }

      console.log("Selected voice:", bestVoice);

      if (!bestVoice && langCode !== "gu-IN" && langCode !== "fr-FR") {
        reject(new Error(`No voice available for ${langCode}`));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = bestVoice ? bestVoice.lang : finalLang;
      utterance.voice = bestVoice;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
        resolve();
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        utteranceRef.current = null;
      };

      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        setIsSpeaking(false);
        setIsPaused(false);
        utteranceRef.current = null;
        reject(event.error);
      };

      utterance.onpause = () => {
        setIsPaused(true);
      };

      utterance.onresume = () => {
        setIsPaused(false);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    });
  };

  const pause = () => {
    if (window.speechSynthesis && isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resume = () => {
    if (window.speechSynthesis && isSpeaking && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const stop = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      utteranceRef.current = null;
    }
  };

  const hasVoiceForLanguage = (langCode) => {
    const bestVoice = getBestVoiceForLanguage(voices, langCode);
    return bestVoice !== null;
  };

  return {
    speak,
    pause,
    resume,
    stop,
    isSpeaking,
    isPaused,
    availableVoices: voices,
    hasVoiceForLanguage
  };
};