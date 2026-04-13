const { ApiError } = require("../middleware/ApiError");
const { prisma } = require("../prisma");

async function createTrip({ routeId, busId, departureTime, arrivalTime, operatorId, isAdmin }) {
  const dep = new Date(departureTime);
  const arr = arrivalTime ? new Date(arrivalTime) : null;
  
  if (Number.isNaN(dep.getTime())) throw new ApiError("Invalid departureTime", 400, "VALIDATION_ERROR");

  const bus = await prisma.bus.findUnique({ where: { id: busId } });
  if (!bus) throw new ApiError("Bus not found", 404, "NOT_FOUND");
  if (!isAdmin && bus.operatorId !== operatorId) {
    throw new ApiError("Not allowed to schedule this bus", 403, "FORBIDDEN");
  }

  const route = await prisma.route.findUnique({ where: { id: routeId } });
  if (!route) throw new ApiError("Route not found", 404, "NOT_FOUND");

  return prisma.trip.create({
    data: {
      routeId,
      busId,
      departureTime: dep,
      arrivalTime: arr,
      status: "SCHEDULED",
    },
    include: {
      route: true,
      bus: true,
    },
  });
}

async function listTrips({ origin, destination, departureFrom, departureTo }) {
  const where = { status: "SCHEDULED" };
  
  if (origin || destination) {
    where.route = {};
    if (origin) where.route.origin = { contains: origin, mode: 'insensitive' };
    if (destination) where.route.destination = { contains: destination, mode: 'insensitive' };
  }

  if (departureFrom || departureTo) {
    where.departureTime = {};
    if (departureFrom) where.departureTime.gte = new Date(departureFrom);
    if (departureTo) where.departureTime.lte = new Date(departureTo);
  }

  const trips = await prisma.trip.findMany({
    where,
    include: {
      route: true,
      bus: { select: { id: true, registrationNumber: true, capacity: true } },
      _count: {
        select: { bookings: { where: { status: { in: ["PENDING", "CONFIRMED"] } } } }
      }
    },
    orderBy: { departureTime: "asc" },
  });

  return trips.map(t => ({
    ...t,
    availableSeatsCount: t.bus.capacity - t._count.bookings
  }));
}

async function getTripAvailability(tripId) {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      bus: { 
        include: { 
          seats: {
            orderBy: { seatNumber: 'asc' }
          }
        } 
      },
      bookings: {
        where: { status: { in: ["PENDING", "CONFIRMED"] } },
        select: { seatId: true }
      }
    }
  });

  if (!trip) throw new ApiError("Trip not found", 404, "NOT_FOUND");

  const bookedSeatIds = new Set(trip.bookings.map(b => b.seatId));

  const seats = trip.bus.seats.map(s => ({
    id: s.id,
    seatNumber: s.seatNumber,
    isAvailable: !bookedSeatIds.has(s.id)
  }));

  return {
    tripId: trip.id,
    departureTime: trip.departureTime,
    status: trip.status,
    seats,
    availableCount: seats.filter(s => s.isAvailable).length
  };
}

module.exports = { createTrip, listTrips, getTripAvailability };

