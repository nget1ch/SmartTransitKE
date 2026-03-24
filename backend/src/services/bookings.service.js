const { ApiError } = require("../middleware/ApiError");
const { prisma } = require("../prisma");

async function createBooking({ userId, tripId, seatNumber }) {
  const seat = Number(seatNumber);
  if (!Number.isInteger(seat)) throw new ApiError("seatNumber must be an integer", 400, "VALIDATION_ERROR");
  if (seat <= 0) throw new ApiError("seatNumber must be positive", 400, "VALIDATION_ERROR");

  return prisma.$transaction(async (tx) => {
    const trip = await tx.trip.findUnique({
      where: { id: tripId },
      include: { bus: true },
    });

    if (!trip) throw new ApiError("Trip not found", 404, "NOT_FOUND");

    const capacity = trip.bus.capacity;
    if (seat > capacity) {
      throw new ApiError(`seatNumber must be between 1 and ${capacity}`, 400, "VALIDATION_ERROR");
    }

    try {
      const booking = await tx.booking.create({
        data: {
          userId,
          tripId,
          seatNumber: seat,
        },
        include: {
          trip: {
            include: {
              route: true,
              bus: true,
            },
          },
        },
      });

      return booking;
    } catch (err) {
      // Unique constraint violation => seat already booked for this trip.
      if (err && err.code === "P2002") {
        throw new ApiError("Seat already booked for this trip", 409, "SEAT_CONFLICT");
      }
      throw err;
    }
  });
}

async function listBookingsByUser({ userId, actor }) {
  if (!actor) throw new ApiError("Unauthorized", 401, "UNAUTHORIZED");
  if (actor.role !== "ADMIN" && actor.id !== userId) throw new ApiError("Forbidden", 403, "FORBIDDEN");

  return prisma.booking.findMany({
    where: { userId },
    orderBy: [{ createdAt: "desc" }],
    include: {
      trip: {
        include: {
          route: true,
          bus: true,
        },
      },
      payment: true,
    },
  });
}

module.exports = { createBooking, listBookingsByUser };

