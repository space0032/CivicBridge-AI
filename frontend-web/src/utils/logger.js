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
        // In production, you might want to send this to a service like Sentry or LogRocket
        console.error(...args);
    }
};

export default logger;
