const LOG_LEVEL = import.meta.env.VITE_LOG_LEVEL || (import.meta.env.PROD ? 'error' : 'debug');

const levels = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLevel = levels[LOG_LEVEL] ?? levels.debug;

const logger = {
  debug: (...args) => {
    if (currentLevel <= levels.debug) {
      console.log('[DEBUG]', ...args);
    }
  },
  info: (...args) => {
    if (currentLevel <= levels.info) {
      console.info('[INFO]', ...args);
    }
  },
  warn: (...args) => {
    if (currentLevel <= levels.warn) {
      console.warn('[WARN]', ...args);
    }
  },
  error: (...args) => {
    if (currentLevel <= levels.error) {
      // In a real app, this would integrate with a logging service like Sentry
      console.error('[ERROR]', ...args);
    }
  },
};

export default logger;
