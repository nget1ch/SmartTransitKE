require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const { errorHandler } = require("./middleware/errorHandler");

const { authRoutes } = require("./routes/auth.routes");
const { routesRoutes } = require("./routes/routes.routes");
const { busesRoutes } = require("./routes/buses.routes");
const { tripsRoutes } = require("./routes/trips.routes");
const { bookingsRoutes } = require("./routes/bookings.routes");
const { paymentsRoutes } = require("./routes/payments.routes");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.json({ ok: true, service: "SmartTransitKE" });
});

app.use("/auth", authRoutes);
app.use("/routes", routesRoutes);
app.use("/buses", busesRoutes);
app.use("/trips", tripsRoutes);
app.use("/bookings", bookingsRoutes);
app.use("/payments", paymentsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`SmartTransitKE API listening on port ${PORT}`);
});

