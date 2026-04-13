const { prisma } = require("../prisma");

async function getAdminDashboardStats() {
  const [
    totalUsers,
    totalBookings,
    totalRevenue,
    popularRoutes,
    recentBookings
  ] = await Promise.all([
    prisma.user.count(),
    prisma.booking.count(),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: "SUCCESS" }
    }),
    prisma.trip.findMany({
      include: {
        route: true,
        _count: { select: { bookings: true } }
      },
      orderBy: { bookings: { _count: "desc" } },
      take: 5
    }),
    prisma.booking.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        trip: { include: { route: true } }
      }
    })
  ]);

  return {
    stats: {
      totalUsers,
      totalBookings,
      totalRevenue: totalRevenue._sum.amount || 0,
    },
    popularRoutes: popularRoutes.map(tr => ({
      route: `${tr.route.origin} -> ${tr.route.destination}`,
      bookings: tr._count.bookings
    })),
    recentBookings: recentBookings.map(b => ({
      id: b.id,
      customer: b.user.name,
      route: `${b.trip.route.origin} -> ${b.trip.route.destination}`,
      status: b.status,
      date: b.createdAt
    }))
  };
}

module.exports = { getAdminDashboardStats };
