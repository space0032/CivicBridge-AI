/**
 * Basic input sanitization to strip HTML tags.
 * @param {string} input - The raw input string.
 * @returns {string} - The sanitized string.
 */
export const sanitize = (input) => {
    if (typeof input !== 'string') return input;
    return input.replace(/<[^>]*>?/gm, '');
};

/**
 * Sanitizes an object of form data.
 * @param {Object} data - The form data object.
 * @returns {Object} - The sanitized form data object.
 */
export const sanitizeObject = (data) => {
    const sanitized = {};
    for (const key in data) {
        sanitized[key] = sanitize(data[key]);
    }
    return sanitized;
};
