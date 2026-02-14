const LOG_LEVEL = import.meta.env.VITE_LOG_LEVEL || (import.meta.env.PROD ? 'error' : 'debug');

const levels = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLevel = levels[LOG_LEVEL] ?? levels.debug;

const sanitize = (args) => {
  return args.map(arg => {
    if (typeof arg === 'object' && arg !== null) {
      const newArg = { ...arg };
      // Mask common sensitive keys
      ['password', 'token', 'secret', 'authorization', 'creditCard'].forEach(key => {
        // Check for case-insensitive match or substring
        Object.keys(newArg).forEach(objKey => {
          if (objKey.toLowerCase().includes(key)) {
            newArg[objKey] = '***';
          }
        });
      });
      return newArg;
    }
    return arg;
  });
};

const logger = {
  debug: (...args) => {
    if (currentLevel <= levels.debug) {
      console.log('[DEBUG]', ...sanitize(args));
    }
  },
  info: (...args) => {
    if (currentLevel <= levels.info) {
      console.info('[INFO]', ...sanitize(args));
    }
  },
  warn: (...args) => {
    if (currentLevel <= levels.warn) {
      console.warn('[WARN]', ...sanitize(args));
    }
  },
  error: (...args) => {
    if (currentLevel <= levels.error) {
      const sanitizedArgs = sanitize(args);
      console.error('[ERROR]', ...sanitizedArgs);
      // In a real app, integrate with monitoring service
      // if (import.meta.env.PROD && window.Sentry) {
      //   window.Sentry.captureException(sanitizedArgs);
      // }
    }
  },
};

export default logger;
