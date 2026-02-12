import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { voiceService } from '../services/api';
import { startSpeechRecognition, textToSpeech } from '../utils/speech';
import { getGeolocation } from '../utils/geolocation';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import './VoiceSearch.css';

const VoiceSearch = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [isListening, setIsListening] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleVoiceInput = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    setError(null);

    recognitionRef.current = startSpeechRecognition(
      (transcript) => {
        setQuery(transcript);
        setIsListening(false);
        processQuery(transcript);
      },
      (error) => {
        setError('Failed to recognize speech. Please try again.');
        setIsListening(false);
      }
    );
  };

  const processQuery = async (queryText) => {
    if (!user) {
      setError('You must be logged in to use voice search.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let location = null;
      try {
        location = await getGeolocation();
      } catch (err) {
        // Location not available
      }

      const response = await voiceService.processQuery({
        queryText: queryText || query,
        language: i18n.language,
        latitude: location?.latitude,
        longitude: location?.longitude,
        userId: user.id
      });

      const responseText = response.data.data;
      setResponse(responseText);

      // Speak the response
      textToSpeech(responseText, i18n.language);
    } catch (err) {
      setError('Failed to process your query. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      processQuery(query);
    }
  };

  const speakResponse = () => {
    if (response) {
      textToSpeech(response, i18n.language);
    }
  };

  return (
    <div className="container">
      <h1 className="title">{t('voice_search')}</h1>
      <p className="subtitle">
        {t('ask_questions')}
      </p>

      <div className="voiceBox">
        <button
          onClick={handleVoiceInput}
          className={`voiceButton ${isListening ? 'voiceButtonListening' : 'voiceButtonIdle'}`}
          aria-label={isListening ? 'Stop listening' : 'Start voice input'}
        >
          {isListening ? <MicOff size={48} /> : <Mic size={48} />}
        </button>
        <p className="voiceStatus">
          {isListening ? t('listening') : t('click_to_speak')}
        </p>
      </div>

      <form onSubmit={handleTextSubmit} className="form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Or type your question here..."
          className="input"
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !query.trim()}
        >
          {loading ? 'Processing...' : 'Ask'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {response && (
        <div className="responseBox">
          <div className="responseHeader">
            <h3>Response:</h3>
            <button
              onClick={speakResponse}
              className="speakButton"
              aria-label="Speak response"
            >
              <Volume2 size={20} />
            </button>
          </div>
          <p className="responseText">{response}</p>
        </div>
      )}

      <div className="examples">
        <h3 className="examplesTitle">Example Questions:</h3>
        <ul className="examplesList">
          <li onClick={() => setQuery('What government subsidies are available for farmers?')}>
            &quot;What government subsidies are available for farmers?&quot;
          </li>
          <li onClick={() => setQuery('Find scholarship programs near me')}>
            &quot;Find scholarship programs near me&quot;
          </li>
          <li onClick={() => setQuery('Where can I get free vaccination for my child?')}>
            &quot;Where can I get free vaccination for my child?&quot;
          </li>
          <li onClick={() => setQuery('What skill training programs are available?')}>
            &quot;What skill training programs are available?&quot;
          </li>
        </ul>
      </div>
    </div>
  );
};

export default VoiceSearch;
