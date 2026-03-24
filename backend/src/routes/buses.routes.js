const express = require("express");
const { z } = require("zod");

const { validate } = require("../middleware/validate");
const { authMiddleware } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/requireRole");
const busesController = require("../controllers/buses.controller");

const busesRoutes = express.Router();

const busSchema = z.object({
  plateNumber: z.string().min(3).max(25),
  capacity: z.number().int().positive(),
});

busesRoutes.post(
  "/",
  authMiddleware,
  requireRole(["ADMIN", "OPERATOR"]),
  validate({ body: busSchema }),
  busesController.createBus
);

module.exports = { busesRoutes };

