const { ApiError } = require("../middleware/ApiError");
const { prisma } = require("../prisma");

async function createRoute({ origin, destination }) {
  const o = String(origin).trim();
  const d = String(destination).trim();

  if (!o || !d) throw new ApiError("origin and destination are required", 400, "VALIDATION_ERROR");

  // Keep it flexible: allow multiple rows for same origin/destination.
  const route = await prisma.route.create({
    data: { origin: o, destination: d },
  });

  return route;
}

async function listRoutes() {
  return prisma.route.findMany({
    orderBy: [{ origin: "asc" }, { destination: "asc" }],
  });
}

module.exports = { createRoute, listRoutes };

