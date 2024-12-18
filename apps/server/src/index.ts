import { createServer } from 'node:http';
import { Server as SocketIOServer } from 'socket.io';
import app from './app';
import socketServers from './routes/socketRoutes';

const PORT = Number.parseInt(process.env.PORT || "") || 8080;

const server = createServer(app);



// Initialize socket servers
for (const socket_server in socketServers) {
  const {path, handler} = socketServers[socket_server];
  
  const io = new SocketIOServer(server,{
    path
  });
  io.on('connection', handler);
}

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
