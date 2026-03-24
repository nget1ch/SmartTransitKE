const express = require("express");
const { z } = require("zod");

const { validate } = require("../middleware/validate");
const { authMiddleware } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/requireRole");
const paymentsController = require("../controllers/payments.controller");

const paymentsRoutes = express.Router();

const paymentSchema = z.object({
  bookingId: z.string().min(1),
  amount: z.number().int().positive(),
});

paymentsRoutes.post(
  "/",
  authMiddleware,
  requireRole(["PASSENGER", "ADMIN"]),
  validate({ body: paymentSchema }),
  paymentsController.createPayment
);

module.exports = { paymentsRoutes };

