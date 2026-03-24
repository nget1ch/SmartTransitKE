const { ApiError } = require("./ApiError");

function requireRole(roles) {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return function roleMiddleware(req, res, next) {
    if (!req.user) return next(new ApiError("Unauthorized", 401, "UNAUTHORIZED"));
    if (!allowed.includes(req.user.role)) {
      return next(new ApiError("Forbidden", 403, "FORBIDDEN"));
    }
    return next();
  };
}

module.exports = { requireRole };

