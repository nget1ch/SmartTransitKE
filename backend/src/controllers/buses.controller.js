const busesService = require("../services/buses.service");

async function createBus(req, res, next) {
  try {
    const bus = await busesService.createBus({
      ...req.body,
      operatorId: req.user.id,
    });
    res.status(201).json(bus);
  } catch (err) {
    next(err);
  }
}

module.exports = { createBus };

