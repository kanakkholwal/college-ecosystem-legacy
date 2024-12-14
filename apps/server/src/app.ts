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
    message: 'Welcome to the server!',
    status: 'healthy' 
  });
});

// Error handling middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: err.message 
  });
});

export default app;
