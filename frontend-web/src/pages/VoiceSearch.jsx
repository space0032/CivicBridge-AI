import React, { useState } from 'react';
import { useIntlayer, useIntlayerContext } from 'react-intlayer';
import { voiceService } from '../services/api';
import { startSpeechRecognition, textToSpeech } from '../utils/speech';
import { getGeolocation } from '../utils/geolocation';
import { Mic, MicOff, Volume2 } from 'lucide-react';

const VoiceSearch = () => {
  const { voice_search } = useIntlayer('common');
  const { locale } = useIntlayerContext();
  const [isListening, setIsListening] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleVoiceInput = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);
    setError(null);

    startSpeechRecognition(
      (transcript) => {
        setQuery(transcript);
        setIsListening(false);
        processQuery(transcript);
      },
      (error) => {
        setError('Failed to recognize speech. Please try again.');
        setIsListening(false);
        console.error(error);
      }
    );
  };

  const processQuery = async (queryText) => {
    try {
      setLoading(true);
      setError(null);
      
      let location = null;
      try {
        location = await getGeolocation();
      } catch (err) {
        console.log('Location not available');
      }

      const response = await voiceService.processQuery({
        queryText: queryText || query,
        language: locale,
        latitude: location?.latitude,
        longitude: location?.longitude,
        userId: 1 // In production, get from auth context
      });

      const responseText = response.data.data;
      setResponse(responseText);
      
      // Speak the response
      textToSpeech(responseText, locale);
    } catch (err) {
      setError('Failed to process your query. Please try again.');
      console.error(err);
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
      textToSpeech(response, locale);
    }
  };

  return (
    <div className="container" style={styles.container}>
      <h1 style={styles.title}>{voice_search}</h1>
      <p style={styles.subtitle}>
        Ask questions about programs, healthcare, education, and jobs
      </p>

      <div style={styles.voiceBox}>
        <button
          onClick={handleVoiceInput}
          style={{
            ...styles.voiceButton,
            backgroundColor: isListening ? '#dc2626' : '#2563eb'
          }}
          aria-label={isListening ? 'Stop listening' : 'Start voice input'}
        >
          {isListening ? <MicOff size={48} /> : <Mic size={48} />}
        </button>
        <p style={styles.voiceStatus}>
          {isListening ? 'Listening...' : 'Click to speak'}
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
          <p style={styles.responseText}>{response}</p>
        </div>
      )}

      <div style={styles.examples}>
        <h3 style={styles.examplesTitle}>Example Questions:</h3>
        <ul style={styles.examplesList}>
          <li onClick={() => setQuery('What government subsidies are available for farmers?')}>
            "What government subsidies are available for farmers?"
          </li>
          <li onClick={() => setQuery('Find scholarship programs near me')}>
            "Find scholarship programs near me"
          </li>
          <li onClick={() => setQuery('Where can I get free vaccination for my child?')}>
            "Where can I get free vaccination for my child?"
          </li>
          <li onClick={() => setQuery('What skill training programs are available?')}>
            "What skill training programs are available?"
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
  title: {
    fontSize: '36px',
    color: '#1f2937',
    marginBottom: '10px',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: '18px',
    color: '#6b7280',
    marginBottom: '40px',
    textAlign: 'center'
  },
  voiceBox: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  voiceButton: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    transition: 'all 0.3s',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  voiceStatus: {
    marginTop: '15px',
    fontSize: '18px',
    color: '#6b7280'
  },
  form: {
    display: 'flex',
    gap: '10px',
    marginBottom: '30px'
  },
  input: {
    flex: 1,
    padding: '12px 20px',
    fontSize: '16px',
    border: '2px solid #e5e7eb',
    borderRadius: '5px'
  },
  error: {
    color: '#dc2626',
    padding: '10px',
    backgroundColor: '#fee2e2',
    borderRadius: '5px',
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
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '8px 12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  },
  responseText: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#1f2937'
  },
  examples: {
    marginTop: '40px'
  },
  examplesTitle: {
    fontSize: '20px',
    color: '#1f2937',
    marginBottom: '15px'
  },
  examplesList: {
    listStyle: 'none',
    padding: 0
  }
};

export default VoiceSearch;
