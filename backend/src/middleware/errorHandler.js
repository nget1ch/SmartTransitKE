const { ZodError } = require("zod");

/**
 * Centralized Express error handler.
 * @param {import("express").ErrorRequestHandler} err
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
function errorHandler(err, req, res, next) {
  // eslint-disable-next-line no-console
  console.error(err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation error",
      details: err.issues.map((i) => ({ path: i.path, message: i.message })),
    });
  }

  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    message: err.message || "Internal server error",
    code: err.code,
  });
}

module.exports = { errorHandler };

