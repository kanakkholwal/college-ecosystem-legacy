import { createServer } from 'node:http';
import app from './app';
import { initWebSocketServer } from './utils/socketServer';

const PORT = process.env.PORT || 3000;

const server = createServer(app);

// Initialize WebSocket server
initWebSocketServer(server);

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
