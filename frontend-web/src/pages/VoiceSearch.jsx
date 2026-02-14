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
      () => {
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
    <div className="container" style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>{t('voice_search')}</h1>
        <p style={styles.subtitle}>{t('ask_questions')}</p>
      </div>

      <div style={styles.voiceBox}>
        <button
          onClick={handleVoiceInput}
          style={{
            ...styles.voiceButton,
            ...(isListening ? styles.voiceButtonListening : styles.voiceButtonIdle)
          }}
          aria-label={isListening ? 'Stop listening' : 'Start voice input'}
        >
          {isListening ? <MicOff size={64} /> : <Mic size={64} />}
        </button>
        <p style={styles.voiceStatus}>
          {isListening ? t('listening') : t('click_to_speak')}
        </p>
      </div>

      <form onSubmit={handleTextSubmit} style={styles.form}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Or type your question here..."
          style={styles.input}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !query.trim()}
        >
          {loading ? 'Processing...' : 'Ask'}
        </button>
      </form>

      {error && <p style={styles.error}>{error}</p>}

      {response && (
        <div style={styles.responseBox}>
          <div style={styles.responseHeader}>
            <h3>Response:</h3>
            <button
              onClick={speakResponse}
              style={styles.speakButton}
              aria-label="Speak response"
            >
              <Volume2 size={20} />
            </button>
          </div>
          <p>{response}</p>
        </div>
      )}

      <div style={styles.examples}>
        <h3 style={styles.examplesTitle}>Example Questions:</h3>
        <ul style={styles.examplesList}>
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

const styles = {
  container: {
    paddingTop: '40px',
    paddingBottom: '40px',
    maxWidth: '800px',
    margin: '0 auto'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  title: {
    fontSize: '36px',
    color: '#1f2937',
    marginBottom: '10px'
  },
  subtitle: {
    fontSize: '18px',
    color: '#6b7280'
  },
  voiceBox: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  voiceButton: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    transition: 'background-color 0.3s, transform 0.2s'
  },
  voiceButtonIdle: {
    backgroundColor: '#2563eb'
  },
  voiceButtonListening: {
    backgroundColor: '#dc2626',
    transform: 'scale(1.1)'
  },
  voiceStatus: {
    marginTop: '15px',
    fontSize: '16px',
    color: '#4b5563'
  },
  form: {
    display: 'flex',
    gap: '10px',
    marginBottom: '30px'
  },
  input: {
    flex: 1,
    padding: '12px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #d1d5db'
  },
  error: {
    color: '#dc2626',
    textAlign: 'center',
    marginBottom: '20px'
  },
  responseBox: {
    backgroundColor: '#f9fafb',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px'
  },
  responseHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  speakButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer'
  },
  examples: {
    marginTop: '40px'
  },
  examplesTitle: {
    fontSize: '20px',
    marginBottom: '15px'
  },
  examplesList: {
    listStyle: 'none',
    padding: 0,
    display: 'grid',
    gap: '10px'
  }
};

export default VoiceSearch;
