import { Router, type Request, type Response } from 'express';
import { scrapeResult } from '~/lib/scrape';

const router = Router();

router.use((req: Request, res: Response, next) => {
  const requiredHeaderKey = "X-IDENTITY-KEY"; // The expected key
  const requiredHeaderValue = process.env.IDENTITY_KEY; // The expected value

  if (req.headers[requiredHeaderKey.toLowerCase()] === requiredHeaderValue) {
    next(); // Header matches, proceed to the route
  } else {
    res.status(403).json({ error: 'Forbidden - Invalid or missing header' });
  }
})
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