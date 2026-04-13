require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const { errorHandler } = require("./middleware/errorHandler");
const { logger } = require("./utils/logger");
const { standardLimiter, authLimiter } = require("./middleware/security.middleware");

const { authRoutes } = require("./routes/auth.routes");
const { routesRoutes } = require("./routes/routes.routes");
const { busesRoutes } = require("./routes/buses.routes");
const { tripsRoutes } = require("./routes/trips.routes");
const { bookingsRoutes } = require("./routes/bookings.routes");
const { paymentsRoutes } = require("./routes/payments.routes");
const { analyticsRoutes } = require("./routes/analytics.routes");

const app = express();

// Security Headers & CORS
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json({ limit: "1mb" }));

// Logging HTTP requests
app.use(morgan("combined", { 
  stream: { write: (message) => logger.info(message.trim()) } 
}));

// Rate Limiting
app.use("/auth", authLimiter);
app.use(standardLimiter);

app.get("/health", (req, res) => {
  res.json({ ok: true, status: "UP", service: "SmartTransitKE" });
});

// Routes
app.use("/auth", authRoutes);
app.use("/routes", routesRoutes);
app.use("/buses", busesRoutes);
app.use("/trips", tripsRoutes);
app.use("/bookings", bookingsRoutes);
app.use("/payments", paymentsRoutes);
app.use("/analytics", analyticsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`SmartTransitKE API listening on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

