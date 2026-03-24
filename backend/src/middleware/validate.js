const { ZodError } = require("zod");

/**
 * Simple zod-based validation middleware.
 * @param {{ body?: any, params?: any, query?: any }} schema
 */
function validate(schema) {
  return function validationMiddleware(req, res, next) {
    try {
      if (schema.body) req.body = schema.body.parse(req.body);
      if (schema.params) req.params = schema.params.parse(req.params);
      if (schema.query) req.query = schema.query.parse(req.query);
      return next();
    } catch (err) {
      if (err instanceof ZodError) return next(err);
      return next(err);
    }
  };
}

module.exports = { validate };

