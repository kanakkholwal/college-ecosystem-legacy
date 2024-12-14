import { Router, type Request, type Response } from 'express';

const router = Router();

// Example GET route
router.get('/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello from HTTP route!' });
});

// Example POST route
router.post('/echo', (req: Request, res: Response) => {
  const body = req.body;
  res.json({ 
    message: 'Echo successful',
    data: body 
  });
});

export default router;