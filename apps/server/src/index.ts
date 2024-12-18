import { createServer } from 'node:http';
import app from './app';
import { initWebSocketServer } from './utils/socketServer';

const PORT = Number.parseInt(process.env.PORT || "") || 8080;

const server = createServer(app);

// Initialize WebSocket server
initWebSocketServer(server);

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
