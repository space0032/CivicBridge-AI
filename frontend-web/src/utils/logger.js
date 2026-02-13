const isProduction = import.meta.env.PROD;

const logger = {
    log: (...args) => {
        if (!isProduction) {
            console.log(...args);
        }
    },
    info: (...args) => {
        if (!isProduction) {
            console.info(...args);
        }
    },
    warn: (...args) => {
        if (!isProduction) {
            console.warn(...args);
        }
    },
    error: (...args) => {
        if (isProduction) {
            // Integration with external monitoring services (e.g., Sentry, LogRocket)
            // Example: Sentry.captureException(args[0]);
            // For now, we'll continue to log but acknowledge it's for production monitoring
            console.error('[Production Error Log]:', ...args);
        } else {
            console.error(...args);
        }
    }
};

export default logger;
