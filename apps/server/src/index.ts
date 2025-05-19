import { createServer } from "node:http";
import app from "./app";

const PORT = Number.parseInt(process.env.PORT || "") || 8080;

// Create HTTP server
const server = createServer(app);


const isDev = process.env.NODE_ENV !== "production";

// Start the server
server.listen(PORT, "0.0.0.0", () => {
  if (isDev) {
    console.log(`Running in development mode at http://localhost:${PORT}`);
  }
});
