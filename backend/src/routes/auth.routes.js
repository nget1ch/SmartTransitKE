const express = require("express");
const { z } = require("zod");

const { validate } = require("../middleware/validate");
const { authMiddleware } = require("../middleware/authMiddleware");
const authController = require("../controllers/auth.controller");

const authRoutes = express.Router();

const registerSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(255),
  password: z.string().min(8).max(255),
  role: z.enum(["ADMIN", "OPERATOR", "PASSENGER"]).optional().default("PASSENGER"),
  registrationKey: z.string().min(1).optional(),
});

const loginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(1).max(255),
});

authRoutes.post("/register", validate({ body: registerSchema }), authController.register);
authRoutes.post("/login", validate({ body: loginSchema }), authController.login);

// Example: authenticated-only endpoints could be added here later.
authRoutes.get("/me", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

module.exports = { authRoutes };

