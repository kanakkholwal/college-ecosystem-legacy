import { createServer } from 'node:http';
import { Server as SocketIOServer } from 'socket.io';
import app from './app';
import socketServers from './routes/socketRoutes';

const PORT = Number.parseInt(process.env.PORT || "") || 8080;

// Create HTTP server
const server = createServer(app);



// Initialize socket servers
for (const socket_server in socketServers) {
    const { path, handler } = socketServers[socket_server];

    const io = new SocketIOServer(server, {
        path,
        cors: {
            origin: (origin, callback) => {
                const CORS_ORIGINS = ["nith.eu.org"];

                if (!origin) {
                    callback(null, false);
                } else if (
                    (process.env.NODE_ENV === 'production' && CORS_ORIGINS.some(o => origin.endsWith(o))) ||
                    (process.env.NODE_ENV === 'development' && origin.startsWith('http://localhost:'))
                ) {
                    callback(null, true);
                } else {
                    callback(new Error('Not allowed by CORS'));
                }
            },
            methods: ["GET", "POST"],
            // allowedHeaders: ["X-IDENTITY-KEY"],
            credentials: true,
        },
    });

    io.on('connection', handler);
}

// Start the server
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
