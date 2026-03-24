const { ApiError } = require("../middleware/ApiError");
const { prisma } = require("../prisma");

async function createTrip({ routeId, busId, departureTime, operatorId, isAdmin }) {
  const dep = new Date(departureTime);
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
    },
    include: {
      route: true,
      bus: true,
    },
  });
}

function parseDateOrUndefined(value) {
  if (value === undefined || value === null || value === "") return undefined;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return undefined;
  return d;
}

async function listTrips({ origin, destination, departureFrom, departureTo }) {
  const departureFromDate = parseDateOrUndefined(departureFrom);
  const departureToDate = parseDateOrUndefined(departureTo);

  const where = {};
  if (origin) where.route = { origin: String(origin).trim() };
  if (destination) where.route = { ...(where.route || {}), destination: String(destination).trim() };
  if (departureFromDate || departureToDate) {
    where.departureTime = {};
    if (departureFromDate) where.departureTime.gte = departureFromDate;
    if (departureToDate) where.departureTime.lte = departureToDate;
  }

  const trips = await prisma.trip.findMany({
    where,
    include: {
      route: { select: { id: true, origin: true, destination: true } },
      bus: { select: { id: true, plateNumber: true, capacity: true } },
    },
    orderBy: [{ departureTime: "asc" }],
  });

  const tripIds = trips.map((t) => t.id);
  const bookedCounts = tripIds.length
    ? await prisma.booking.groupBy({
        by: ["tripId"],
        where: { tripId: { in: tripIds } },
        _count: { _all: true },
      })
    : [];

  const bookedMap = new Map(bookedCounts.map((row) => [row.tripId, row._count._all]));

  return trips.map((t) => {
    const capacity = t.bus.capacity;
    const booked = bookedMap.get(t.id) || 0;
    const availableSeats = Math.max(capacity - booked, 0);
    return {
      id: t.id,
      departureTime: t.departureTime,
      route: t.route,
      bus: t.bus,
      capacity,
      bookedSeatsCount: booked,
      availableSeats,
    };
  });
}

async function getTripAvailability(tripId, { includeSeats = false, availableLimit = 20 } = {}) {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      route: { select: { origin: true, destination: true } },
      bus: { select: { capacity: true, plateNumber: true } },
    },
  });

  if (!trip) throw new ApiError("Trip not found", 404, "NOT_FOUND");

  const booked = await prisma.booking.findMany({
    where: { tripId },
    select: { seatNumber: true },
    orderBy: { seatNumber: "asc" },
  });

  const bookedSeatNumbers = booked.map((b) => b.seatNumber);
  const capacity = trip.bus.capacity;
  const availableCount = Math.max(capacity - bookedSeatNumbers.length, 0);

  if (!includeSeats) {
    return {
      tripId,
      route: trip.route,
      bus: { plateNumber: trip.bus.plateNumber, capacity },
      capacity,
      bookedSeats: bookedSeatNumbers,
      availableCount,
    };
  }

  const bookedSet = new Set(bookedSeatNumbers);
  const availableSeatNumbers = [];
  for (let seat = 1; seat <= capacity; seat += 1) {
    if (!bookedSet.has(seat)) availableSeatNumbers.push(seat);
    if (availableSeatNumbers.length >= availableLimit) break;
  }

  return {
    tripId,
    route: trip.route,
    bus: { plateNumber: trip.bus.plateNumber, capacity },
    capacity,
    bookedSeats: bookedSeatNumbers,
    availableCount,
    availableSeats: availableSeatNumbers,
  };
}

module.exports = { createTrip, listTrips, getTripAvailability };

