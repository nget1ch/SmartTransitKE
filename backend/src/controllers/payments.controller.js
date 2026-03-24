const paymentsService = require("../services/payments.service");

async function createPayment(req, res, next) {
  try {
    const payment = await paymentsService.createPayment({
      actor: req.user,
      bookingId: req.body.bookingId,
      amount: req.body.amount,
    });
    res.status(201).json(payment);
  } catch (err) {
    next(err);
  }
}

module.exports = { createPayment };

