import type { NextFunction, Request, Response } from "express";
import express from "express";
// import rateLimit from "express-rate-limit";
import cors from "cors";
import { config } from "./config";
import httpRoutes from "./routes/httpRoutes";
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
// });
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  // origin: (origin, callback) => {
  //   if (!origin || config.corsOrigins.some((o) => origin.endsWith(o))) {
  //     callback(null, true);
  //   } else {
  //     callback(new Error("CORS policy does not allow this origin"));
  //   }
  // },
  origin:"*",
  optionsSuccessStatus: 200, // For legacy browser support
  methods: "GET,POST,OPTIONS,PUT,DELETE",
  allowedHeaders: "Content-Type,X-Identity-Key,X-Authorization",
  credentials: true,
}));
// app.use(limiter);

// Default route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the server!",
    status: "healthy",
  });
});

const SERVER_IDENTITY = config.SERVER_IDENTITY;
if (!SERVER_IDENTITY) throw new Error("SERVER_IDENTITY is required in ENV");

// Middleware to handle custom CORS logic
app.use((req: Request, res: Response, next: NextFunction): void => {
  const origin = req.header("Origin") || req.header("Referrer") || "";
  const identityKey = req.header("X-Identity-Key") || "";
  const authorization = req.header("X-Authorization") || "";
  // Allow server-to-server calls with X-Identity-Key,X-Authorization
  console.log(` Identity Key: ${identityKey}, Authorization: ${authorization}`);
  // Server-to-server calls with X-Identity-Key,X-Authorization
  
  if (!origin) {
    console.warn("CORS request without origin, skipping CORS headers");
    if (authorization === SERVER_IDENTITY) {
      next();
      return;
    }
    res
      .status(403)
      .json({ error:"Missing or invalid Authorization headers",data: null });
    return;
  }
  console.log(`CORS request from origin: ${origin}`);
  if (authorization === SERVER_IDENTITY) {
    next();
    return; // Explicitly end processing here
  }
  // If the origin is not allowed, block the request
  console.warn(`CORS request from disallowed origin: ${origin}`);
  res.status(403).json({ error: "CORS policy does not allow this origin", data: null });
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

// Catch-all route for undefined routes
app.use((req, res) => {
  res.status(404).json({
    message: "Not Found",
    error: "The requested resource could not be found.",
    data: null,
  });
});
export default app;