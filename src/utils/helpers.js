/**
 * Format response data consistently
 * @param {Object} data - Data to format
 * @param {string} message - Optional message
 * @returns {Object} Formatted response
 */
const formatResponse = (data, message = null) => {
  return {
    success: true,
    timestamp: new Date().toISOString(),
    message,
    data
  };
};

/**
 * Format error response consistently
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {Object} details - Additional error details
 * @returns {Object} Formatted error response
 */
const formatError = (message, statusCode = 500, details = null) => {
  return {
    success: false,
    timestamp: new Date().toISOString(),
    error: {
      message,
      statusCode,
      details
    }
  };
};

/**
 * Sanitize search query
 * @param {string} query - Raw query string
 * @returns {string} Sanitized query
 */
const sanitizeQuery = (query) => {
  if (typeof query !== 'string') {
    return '';
  }
  
  return query
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 1000); // Limit length
};

/**
 * Parse search options and set defaults
 * @param {Object} options - Raw options object
 * @returns {Object} Parsed options with defaults
 */
const parseSearchOptions = (options = {}) => {
  return {
    model: options.model || 'llama-3.1-sonar-small-128k-online',
    max_tokens: Math.min(Math.max(parseInt(options.max_tokens) || 1000, 1), 4000),
    temperature: Math.min(Math.max(parseFloat(options.temperature) || 0.2, 0), 2),
    top_p: Math.min(Math.max(parseFloat(options.top_p) || 0.9, 0), 1),
    return_citations: Boolean(options.return_citations !== false),
    return_images: Boolean(options.return_images),
    recency_filter: options.recency_filter || 'month'
  };
};

/**
 * Generate request ID for tracking
 * @returns {string} Unique request ID
 */
const generateRequestId = () => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Calculate processing time
 * @param {number} startTime - Start time in milliseconds
 * @returns {number} Processing time in milliseconds
 */
const calculateProcessingTime = (startTime) => {
  return Date.now() - startTime;
};

module.exports = {
  formatResponse,
  formatError,
  sanitizeQuery,
  parseSearchOptions,
  generateRequestId,
  calculateProcessingTime
};