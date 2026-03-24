const authService = require("../services/auth.service");

async function register(req, res, next) {
  try {
    const user = await authService.register(req.body);
    // Token issued at registration makes the API easier to consume.
    const { token } = await authService.login({ email: req.body.email, password: req.body.password });
    return res.status(201).json({ token, user });
  } catch (err) {
    return next(err);
  }
}

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

module.exports = { register, login };

