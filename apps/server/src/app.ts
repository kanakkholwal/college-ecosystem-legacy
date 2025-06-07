import type { NextFunction, Request, Response } from "express";
import express from "express";
import { config } from "./config";
import httpRoutes from "./routes/httpRoutes";


// import {rateLimit} from "express-rate-limit";
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   statusCode: 429, // HTTP status code to send when the limit is reached
//   message: {
//     error: true,
//     data: null,
//     message: "Too many requests, please try again later.",
//   },
// });
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(limiter); // Apply rate limiting middleware
app.set('trust proxy', true); // to get correct IP behind proxy

// Default route
app.get("/", (req, res) => {
  res.json({
    error:null,
    data:null,
    message: "Welcome to NITH API",
  });
});
// const isOriginAllowed = (origin: string): boolean => {
//   return CORS_ORIGINS.includes(origin);
// };

const SERVER_IDENTITY = config.SERVER_IDENTITY;
if (!SERVER_IDENTITY) throw new Error("SERVER_IDENTITY is required in ENV");

// Middleware to handle custom CORS logic
app.use((req: Request, res: Response, next: NextFunction): void => {
  const origin = req.header("Origin") || "";
  const identityKey = req.header("X-Authorization") || "";

  // Server-to-server calls with X-Authorization
  if (!origin) {
    if (identityKey === SERVER_IDENTITY) {
      next();
      return;
    }
    res
      .status(403)
      .json({ error: true, data: "Missing or invalid SERVER_IDENTITY" });
    return;
  }

  // CORS logic for browser requests
  if (
    (process.env.NODE_ENV === "production" &&
      config.corsOrigins.some((o) => origin.endsWith(o))) ||
    (process.env.NODE_ENV !== "production" &&
      origin.startsWith("http://localhost:"))
  ) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS,DELETE,PUT");
    res.header("Access-Control-Allow-Headers", "Content-Type,X-Authorization,Origin");
    res.header("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
      res.sendStatus(200); // Preflight request
      return;
    }
    next();
    return; // Explicitly end processing here
  }
  if (identityKey === SERVER_IDENTITY) {
    next();
    return; // Explicitly end processing here
  }

  // Block invalid CORS origins
  res.status(403).json({ error: "CORS policy does not allow this origin" });
});

// Routes
app.use("/api", httpRoutes);

// Error handling middleware

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({
      error: err,
      data: null,
      message: err.message || "Something went wrong!",
    });
  }
);

export default app;
