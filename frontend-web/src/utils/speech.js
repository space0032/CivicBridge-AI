let voices = [];

const loadVoices = () => {
  if ('speechSynthesis' in window) {
    voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
      };
    }
  }
};

loadVoices();

export const getAvailableVoices = () => voices;

export const startSpeechRecognition = (onResult, onError, lang = 'en-US') => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    onError(new Error('Speech recognition not supported'));
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = lang;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onerror = (event) => {
    onError(event.error);
  };

  recognition.start();
  return recognition;
};

export const textToSpeech = (text, lang = 'en-US', selectedVoiceURI = null) => {
  if (!('speechSynthesis' in window)) {
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;

  if (selectedVoiceURI) {
    const selectedVoice = voices.find(voice => voice.voiceURI === selectedVoiceURI);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
  }

  window.speechSynthesis.cancel(); // Cancel any previous speech
  window.speechSynthesis.speak(utterance);
};
