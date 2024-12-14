import { Router, type Request, type Response } from 'express';
import { scrapeResult } from '~/lib/scrape';

const router = Router();

// Example GET route
router.get('/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello from HTTP route!' });
});

// Example POST route
router.post('/result/:rollNo', async(req: Request, res: Response) => {
  const rollNo = req.params.rollNo;
  const data = await scrapeResult(rollNo);

  res.json(data);
});

export default router;