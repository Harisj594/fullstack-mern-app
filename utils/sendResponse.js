/**
 * Sends a standard JSON response for success or error
 *
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code (200, 400, etc.)
 * @param {string} message - Human-readable message
 * @param {object|Array|null} data - The actual result/payload
 * @param {boolean} success - Optional (default: true)
 **/

const sendResponse = (
  res,
  statusCode,
  message,
  data = null,
  success = true,
) => {
  return res.status(statusCode).json({
    success,
    message,
    result: data || {},
  });
};

module.exports = sendResponse;
