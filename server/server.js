import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import path from "path";

import connectDB from "./config/db.js";
import { initBlockchain } from "./config/blockchain.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import blockchainRoutes from "./routes/blockchainRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import verificationRoutes from "./routes/verificationRoutes.js";

dotenv.config();

const app = express();
const allowedOrigins = ["http://localhost:5173", process.env.CLIENT_URL].filter(Boolean);

await connectDB();
initBlockchain();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      try {
        const hostname = new URL(origin).hostname;
        if (hostname.endsWith(".vercel.app")) {
          callback(null, true);
          return;
        }
      } catch (_error) {
        // Ignore malformed origin and reject below.
      }
      callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/uploads", express.static(path.resolve("uploads")));

app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    message: "BlockCertify backend is live. Use /api/health to check API status."
  });
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "BlockCertify API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/verify", verificationRoutes);
app.use("/api/blockchain", blockchainRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`BlockCertify server running on port ${PORT}`);
});
