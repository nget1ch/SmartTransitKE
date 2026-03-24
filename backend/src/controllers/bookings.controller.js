const bookingsService = require("../services/bookings.service");

async function createBooking(req, res, next) {
  try {
    const booking = await bookingsService.createBooking({
      userId: req.user.id,
      tripId: req.body.tripId,
      seatNumber: req.body.seatNumber,
    });
    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
}

async function getBookingsByUser(req, res, next) {
  try {
    const bookings = await bookingsService.listBookingsByUser({
      userId: req.params.userId,
      actor: req.user,
    });
    res.json(bookings);
  } catch (err) {
    next(err);
  }
}

module.exports = { createBooking, getBookingsByUser };

