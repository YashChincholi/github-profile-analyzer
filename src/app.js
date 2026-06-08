import express from "express";
import morgan from "morgan";

import helmet from "helmet";
import rateLimit from "express-rate-limit";

import env from "./config/env.js";

import userRoutes from "./routes/userRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";

import { connectWithRetry } from "./db/connectWithRetry.js";

import AppError from "./utils/AppError.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

// Security hardening
app.disable("x-powered-by");

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

// Request body limits
app.use(
  express.json({
    limit: "10kb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10kb",
  }),
);

app.use(morgan("dev"));

await connectWithRetry();

app.use("/api/users", userRoutes);
app.use("/health", healthRoutes);

// 404 handler
app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// Global error handler
app.use(errorHandler);

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
