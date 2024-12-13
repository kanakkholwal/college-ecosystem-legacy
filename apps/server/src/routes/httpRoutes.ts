import express from 'express';
import httpRoutes from './routes/httpRoutes';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', httpRoutes);

// Default route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to the Node.js TypeScript WebSocket Server',
    status: 'healthy' 
  });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: err.message 
  });
});

export default app;
