const express = require("express");
const { z } = require("zod");

const { validate } = require("../middleware/validate");
const { authMiddleware } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/requireRole");
const tripsController = require("../controllers/trips.controller");

const tripsRoutes = express.Router();

const tripSchema = z.object({
  routeId: z.string().min(1),
  busId: z.string().min(1),
  departureTime: z.string().datetime(),
});

tripsRoutes.post(
  "/",
  authMiddleware,
  requireRole(["ADMIN", "OPERATOR"]),
  validate({ body: tripSchema }),
  tripsController.createTrip
);

tripsRoutes.get("/", tripsController.listTrips);
tripsRoutes.get("/:tripId/availability", tripsController.availability);

module.exports = { tripsRoutes };

