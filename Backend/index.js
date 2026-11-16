import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB, pool } from "./config/db.js";
import { logger, httpLogger } from "./config/logger.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";
import { securityHeaders } from "./middlewares/security.middleware.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config({ path: "./.env" });

const app = express();
const port = process.env.PORT || 4000;
app.disable("x-powered-by");

app.use(securityHeaders);

const allowedOrigins = [
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : []),
  ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL] : []),
]
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "256kb" }));
app.use(cookieParser());
app.use(httpLogger);
app.set("json spaces", 2);

app.get("/api/test", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend API is working successfully!",
  });
});

app.get("/api/health", async (_req, res, next) => {
  try {
    await pool.query("SELECT 1");
    return res.status(200).json({
      success: true,
      database: "connected",
    });
  } catch (error) {
    return next(error);
  }
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/auth", authRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  connectDB()
    .then(() => {
      app.listen(port, () => {
        logger.info(`Server is running on port ${port}`);
      });
    })
    .catch((err) => {
      logger.error({ err }, "Failed to connect to Neon PostgreSQL database");
      process.exit(1);
    });
}

export default app;
