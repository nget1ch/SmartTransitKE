const jwt = require("jsonwebtoken");
const { ApiError } = require("./ApiError");

/**
 * Bearer-token auth middleware.
 * Attaches req.user = { id, email, name, role }.
 */
function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(new ApiError("Missing or invalid Authorization header", 401, "UNAUTHORIZED"));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
    return next();
  } catch (err) {
    return next(new ApiError("Invalid or expired token", 401, "UNAUTHORIZED"));
  }
}

module.exports = { authMiddleware };

