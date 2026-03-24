const { PrismaClient } = require("@prisma/client");

// Prevent exhausting DB connections in dev (hot reload).
// eslint-disable-next-line no-undef
const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

module.exports = { prisma };

