const analyticsService = require("../services/analytics.service");
const { logger } = require("../utils/logger");

async function getStats(req, res, next) {
  try {
    const stats = await analyticsService.getAdminDashboardStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
}

async function getLogs(req, res, next) {
  try {
    // In a real production app, you might fetch from a DB table for AuditLogs 
    // or stream the Winston log files. Here we fetch from AuditLog table.
    const { prisma } = require("../prisma");
    const logs = await prisma.auditLog.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } }
    });
    res.json(logs);
  } catch (err) {
    next(err);
  }
}

module.exports = { getStats, getLogs };
