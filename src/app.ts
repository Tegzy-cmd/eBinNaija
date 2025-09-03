import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { connectDB } from "./config/db";
import redis from "./config/redis";

// Routes
import authRoutes from "./routes/auth";
// import pickupRoutes from "./routes/pickups";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));



app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1/pickups", pickupRoutes);

app.get("/", (_, res) => res.send("🌍 eWaste API Running..."));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await connectDB();
  redis; // ensure Redis initializes
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
