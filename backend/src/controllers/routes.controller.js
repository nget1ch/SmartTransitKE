const routesService = require("../services/routes.service");

async function createRoute(req, res, next) {
  try {
    const route = await routesService.createRoute(req.body);
    res.status(201).json(route);
  } catch (err) {
    next(err);
  }
}

async function listRoutes(req, res, next) {
  try {
    const routes = await routesService.listRoutes();
    res.json(routes);
  } catch (err) {
    next(err);
  }
}

module.exports = { createRoute, listRoutes };

