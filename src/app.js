import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";

import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { connectWithRetry } from "./db/connectWithRetry.js";

dotenv.config();

const app = express();

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

app.use(express.json());
app.use(morgan("dev"));
await connectWithRetry();

app.use("/api/users", userRoutes);
app.use("/health", healthRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
