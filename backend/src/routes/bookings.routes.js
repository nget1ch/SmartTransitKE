const express = require("express");
const { z } = require("zod");

const { validate } = require("../middleware/validate");
const { authMiddleware } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/requireRole");
const bookingsController = require("../controllers/bookings.controller");

const bookingsRoutes = express.Router();

const bookingSchema = z.object({
  tripId: z.string().min(1),
  seatNumber: z.number().int().positive(),
});

const getBookingsParamsSchema = z.object({
  userId: z.string().min(1),
});

bookingsRoutes.post(
  "/",
  authMiddleware,
  requireRole(["PASSENGER"]),
  validate({ body: bookingSchema }),
  bookingsController.createBooking
);

bookingsRoutes.get(
  "/:userId",
  authMiddleware,
  requireRole(["PASSENGER", "ADMIN"]),
  validate({ params: getBookingsParamsSchema }),
  bookingsController.getBookingsByUser
);

module.exports = { bookingsRoutes };

