const { ApiError } = require("../middleware/ApiError");
const { prisma } = require("../prisma");

async function createBus({ plateNumber, capacity, operatorId }) {
  const plate = String(plateNumber).trim().toUpperCase();
  const cap = Number(capacity);

  if (!plate) throw new ApiError("plateNumber is required", 400, "VALIDATION_ERROR");
  if (!Number.isInteger(cap) || cap <= 0) throw new ApiError("capacity must be a positive integer", 400, "VALIDATION_ERROR");

  try {
    return prisma.bus.create({
      data: {
        plateNumber: plate,
        capacity: cap,
        operatorId,
      },
    });
  } catch (err) {
    if (err && err.code === "P2002") throw new ApiError("plateNumber already exists", 409, "CONFLICT");
    throw err;
  }
}

module.exports = { createBus };

