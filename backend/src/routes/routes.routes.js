const express = require("express");
const { z } = require("zod");

const { validate } = require("../middleware/validate");
const { authMiddleware } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/requireRole");
const routesController = require("../controllers/routes.controller");

const routesRoutes = express.Router();

const routeSchema = z.object({
  origin: z.string().min(1).max(120),
  destination: z.string().min(1).max(120),
});

routesRoutes.post(
  "/",
  authMiddleware,
  requireRole(["ADMIN", "OPERATOR"]),
  validate({ body: routeSchema }),
  routesController.createRoute
);

routesRoutes.get("/", routesController.listRoutes);

module.exports = { routesRoutes };

