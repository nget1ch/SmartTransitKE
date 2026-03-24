const { ApiError } = require("../middleware/ApiError");
const { prisma } = require("../prisma");

async function createPayment({ actor, bookingId, amount }) {
  const id = String(bookingId);
  const amt = Number(amount);

  if (!id) throw new ApiError("bookingId is required", 400, "VALIDATION_ERROR");
  if (!Number.isInteger(amt) || amt <= 0) throw new ApiError("amount must be a positive integer", 400, "VALIDATION_ERROR");

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      user: { select: { id: true } },
      payment: true,
    },
  });

  if (!booking) throw new ApiError("Booking not found", 404, "NOT_FOUND");

  if (actor.role !== "ADMIN" && booking.userId !== actor.id) throw new ApiError("Forbidden", 403, "FORBIDDEN");

  if (booking.payment) {
    return booking.payment; // idempotent: do not double-create payments
  }

  // Mocked payment processing: always succeeds for now.
  const payment = await prisma.payment.create({
    data: {
      bookingId: id,
      amount: amt,
      status: "PAID",
    },
  });

  return payment;
}

module.exports = { createPayment };

