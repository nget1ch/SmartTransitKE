class ApiError extends Error {
  /**
   * @param {string} message
   * @param {number} statusCode
   * @param {string=} code
   */
  constructor(message, statusCode, code) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode || 500;
    this.code = code;
  }
}

module.exports = { ApiError };

