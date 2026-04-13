const { ApiError } = require("../middleware/ApiError");
const { prisma } = require("../prisma");
const { logger } = require("../utils/logger");

async function createBus({ registrationNumber, capacity, operatorId }) {
  const reg = String(registrationNumber).trim().toUpperCase();
  const cap = Number(capacity);

  if (!reg) throw new ApiError("registrationNumber is required", 400, "VALIDATION_ERROR");
  if (!Number.isInteger(cap) || cap <= 0) throw new ApiError("capacity must be a positive integer", 400, "VALIDATION_ERROR");

  try {
    return await prisma.$transaction(async (tx) => {
      const bus = await tx.bus.create({
        data: {
          registrationNumber: reg,
          capacity: cap,
          operatorId,
        },
      });

      // Automatically generate seats for the bus
      const seatsData = Array.from({ length: cap }, (_, i) => ({
        busId: bus.id,
        seatNumber: i + 1,
      }));

      await tx.seat.createMany({
        data: seatsData,
      });

      logger.info(`Bus created: ${reg} with ${cap} seats.`);
      return { ...bus, seatsGenerated: cap };
    });
  } catch (err) {
    if (err && err.code === "P2002") throw new ApiError("registrationNumber already exists", 409, "CONFLICT");
    logger.error("Bus creation failed", { error: err });
    throw err;
  }
}

async function listBuses(operatorId = null) {
  const where = operatorId ? { operatorId } : {};
  return prisma.bus.findMany({
    where,
    include: {
      _count: { select: { seats: true, trips: true } },
    },
  });
}

module.exports = { createBus, listBuses };

