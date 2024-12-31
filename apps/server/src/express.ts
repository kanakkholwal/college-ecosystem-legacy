import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import httpRoutes from './routes/httpRoutes';

const expressServer = express();

// Middleware
expressServer.use(express.json());
expressServer.use(express.urlencoded({ extended: true }));

// Default route
expressServer.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to the server!',
    status: 'healthy' 
  });
});
const CORS_ORIGINS = ['nith.eu.org',"app.nith.eu.org"];

// Middleware to handle custom CORS logic
expressServer.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.header('Origin') || '';

  // Allow requests without an Origin header (e.g., direct browser requests)
  if (!origin && process.env.NODE_ENV !== 'production') {
      return next();
  }

  // Check CORS for specific origins
  if (
      (process.env.NODE_ENV === 'production' && CORS_ORIGINS.some(o => origin.endsWith(o))) ||
      (process.env.NODE_ENV !== 'production' && origin.startsWith('http://localhost:'))
  ) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type,X-IDENTITY-KEY');
      res.header('Access-Control-Allow-Credentials', 'true');
      if (req.method === 'OPTIONS') {
          return res.sendStatus(200); // Preflight request
      }
  } else {
      return res.status(403).json({ error: 'CORS policy does not allow this origin' });
  }

  next();
});

// Routes
expressServer.use('/api', httpRoutes);


// Error handling middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
expressServer.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: err.message 
  });
});

export default expressServer;
