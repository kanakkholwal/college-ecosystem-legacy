import { Router, type Request, type Response } from 'express';
import { scrapeResult } from '~/lib/scrape';

const router = Router();

router.use((req: Request, res: Response, next) => {
  const requiredHeaderKey = "X-IDENTITY-KEY";
  const requiredHeaderValue = process.env.IDENTITY_KEY;

  if (req.headers[requiredHeaderKey.toLowerCase()] === requiredHeaderValue) {
    next();
  } else {
    res.status(403).json({ error: 'Forbidden - Invalid or missing header' });
  }
})


// get result by rollNo scraped from website
router.post('/result/:rollNo', async (req: Request, res: Response) => {
  const rollNo = req.params.rollNo;
  const data = await scrapeResult(rollNo);

  res.json(data);
});

export default router;