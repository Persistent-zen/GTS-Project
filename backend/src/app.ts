import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import scoreRoutes from "./routes/scoreRoutes";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import { errorHandler } from "./middleware/errorHandler";
import { setupSwagger } from "./config/swagger";

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Swagger Docs
setupSwagger(app);

// Routes
app.use("/api/score", scoreRoutes);
app.use("/api/users", userRoutes);  // ✅ Now users are connected
app.use("/api/auth", authRoutes);

// Health check
app.get("/", (_req, res) => res.send("Backend is running"));

// Centralized Error Handler
app.use(errorHandler);

export default app;
