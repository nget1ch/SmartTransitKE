const tripsService = require("../services/trips.service");

async function createTrip(req, res, next) {
  try {
    const trip = await tripsService.createTrip({
      ...req.body,
      operatorId: req.user.id,
      isAdmin: req.user.role === "ADMIN",
    });
    res.status(201).json(trip);
  } catch (err) {
    next(err);
  }
}

async function listTrips(req, res, next) {
  try {
    const trips = await tripsService.listTrips({
      origin: req.query.origin,
      destination: req.query.destination,
      departureFrom: req.query.departureFrom,
      departureTo: req.query.departureTo,
    });
    res.json(trips);
  } catch (err) {
    next(err);
  }
}

async function availability(req, res, next) {
  try {
    const includeSeats = String(req.query.includeSeats || "").toLowerCase() === "true";
    const availableLimit = Number(req.query.availableLimit || 20);
    const availability = await tripsService.getTripAvailability(req.params.tripId, {
      includeSeats,
      availableLimit: Number.isFinite(availableLimit) && availableLimit > 0 ? availableLimit : 20,
    });
    res.json(availability);
  } catch (err) {
    next(err);
  }
}

module.exports = { createTrip, listTrips, availability };

