/**
 * Logger utility for development-only console logging
 * Prevents console statements from appearing in production builds
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
    error: (...args: any[]) => {
        if (isDevelopment) {
            console.error(...args);
        }
    },

    warn: (...args: any[]) => {
        if (isDevelopment) {
            console.warn(...args);
        }
    },

    log: (...args: any[]) => {
        if (isDevelopment) {
            console.log(...args);
        }
    },

    info: (...args: any[]) => {
        if (isDevelopment) {
            console.info(...args);
        }
    }
};
