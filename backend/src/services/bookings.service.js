const { ApiError } = require("../middleware/ApiError");
const { prisma } = require("../prisma");
const { logger } = require("../utils/logger");

async function createBooking({ userId, tripId, seatId }) {
  return prisma.$transaction(async (tx) => {
    // 1. Fetch Trip and Bus Information (with locking)
    const trip = await tx.trip.findUnique({
      where: { id: tripId },
      include: { bus: true },
    });

    if (!trip) throw new ApiError("Trip not found", 404, "NOT_FOUND");
    if (trip.status !== "SCHEDULED") throw new ApiError("Trip is not available for booking", 400, "INVALID_STATE");

    // 2. Validate Seat belongs to Trip's Bus
    const seat = await tx.seat.findUnique({
      where: { id: seatId },
    });

    if (!seat) throw new ApiError("Seat not found", 404, "NOT_FOUND");
    if (seat.busId !== trip.busId) {
      throw new ApiError("This seat does not belong to the bus assigned to this trip", 400, "VALIDATION_ERROR");
    }

    // 3. Prevent Double Booking (Constraint-safe)
    // The @@unique([tripId, seatId]) in schema handles this, but we check for readability
    const existing = await tx.booking.findFirst({
      where: {
        tripId,
        seatId,
        status: { in: ["PENDING", "CONFIRMED"] },
      },
    });

    if (existing) {
      // If it's PENDING and expired, we could release it here, but background job is better
      throw new ApiError("Seat already reserved or confirmed", 409, "SEAT_CONFLICT");
    }

    // 4. Create Booking (PENDING)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes window

    const booking = await tx.booking.create({
      data: {
        userId,
        tripId,
        seatId,
        status: "PENDING",
        expiresAt,
      },
      include: {
        trip: { include: { route: true, bus: true } },
        seat: true,
      },
    });

    // 5. Audit Log
    await tx.auditLog.create({
      data: {
        userId,
        action: "CREATE_BOOKING",
        resource: "Booking",
        resourceId: booking.id,
        detail: { tripId, seatId, expiresAt },
      },
    });

    logger.info(`Booking created: ${booking.id} for user ${userId}. Expires at ${expiresAt}`);
    
    return booking;
  }, {
    isolationLevel: "Serializable", // Strict isolation to prevent race conditions
  });
}

async function getBookingDetails(bookingId, userId, role) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      trip: { include: { route: true, bus: true } },
      seat: true,
      user: { select: { id: true, name: true, email: true } },
      payment: true,
    },
  });

  if (!booking) throw new ApiError("Booking not found", 404, "NOT_FOUND");

  // Authorization check
  if (role !== "ADMIN" && booking.userId !== userId) {
    throw new ApiError("Access denied", 403, "FORBIDDEN");
  }

  return booking;
}

async function expireUnpaidBookings() {
  const now = new Date();
  
  const result = await prisma.booking.updateMany({
    where: {
      status: "PENDING",
      expiresAt: { lt: now },
    },
    data: {
      status: "EXPIRED",
    },
  });

  if (result.count > 0) {
    logger.info(`Expired ${result.count} unpaid bookings`);
  }
  
  return result.count;
}

module.exports = { createBooking, getBookingDetails, expireUnpaidBookings };

