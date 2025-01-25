import type { NextFunction, Request, Response } from "express";
import express from "express";
import rateLimit from "express-rate-limit";
import httpRoutes from "./routes/httpRoutes";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

// Default route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the server!",
    status: "healthy",
  });
});
const CORS_ORIGINS = ["https://nith.eu.org", "https://app.nith.eu.org"];
const isOriginAllowed = (origin: string): boolean => {
  return CORS_ORIGINS.includes(origin);
};

const SERVER_IDENTITY = process.env.SERVER_IDENTITY;
if (!SERVER_IDENTITY) throw new Error("SERVER_IDENTITY is required in ENV");

// Middleware to handle custom CORS logic
app.use((req: Request, res: Response, next: NextFunction): void => {
  const origin = req.header("Origin") || "";
  const identityKey = req.header("X-IDENTITY-KEY") || "";

  // Server-to-server calls with X-IDENTITY-KEY
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
  if (origin === "null") {
    res.status(403).json({ error: "CORS policy does not allow null origin" });
    return;
  }
  if (isOriginAllowed(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type,X-IDENTITY-KEY");
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
      message: "Something went wrong!",
      error: err.message,
    });
  }
);

export default app;
