import type { Server as HttpServer } from 'node:http';
import { WebSocket, WebSocketServer } from 'ws';

// Store active connections
const clients: Set<WebSocket> = new Set();

export function initWebSocketServer(server: HttpServer): void {
    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws: WebSocket) => {
        // Add to active clients
        clients.add(ws);

        // Connection is up, let's add a simple simple event
        ws.on('message', (message: string) => {
            console.log('Received:', message);

            try {
                // Parse incoming message
                const parsedMessage = JSON.parse(message);

                // Example of routing different message types
                switch (parsedMessage.type) {
                    case 'chat':
                        broadcastMessage(JSON.stringify({
                            type: 'chat',
                            sender: parsedMessage.sender,
                            message: parsedMessage.message
                        }), ws);
                        break;

                    case 'ping':
                        ws.send(JSON.stringify({
                            type: 'pong',
                            timestamp: Date.now()
                        }));
                        break;

                    default:
                        ws.send(JSON.stringify({
                            type: 'error',
                            message: 'Unknown message type'
                        }));
                }
            } catch (error) {
                console.error('Error processing message:', error);
                ws.send(JSON.stringify({
                    type: 'error',
                    message: 'Invalid message format'
                }));
            }
        });

        // Handle connection close
        ws.on('close', () => {
            clients.delete(ws);
            console.log('Client disconnected');
        });

        // Welcome message
        ws.send(JSON.stringify({
            type: 'system',
            message: 'Welcome to the WebSocket server!'
        }));
    });
}

// Broadcast message to all clients except sender
function broadcastMessage(message: string, sender: WebSocket): void {
    for (const client of clients) {
        // clients.forEach((client) => {
        if (client !== sender && client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
        // });
    }
}

// Helper to get active client count
export function getClientCount(): number {
    return clients.size;
}
