import {  type Request, type Response, Router } from 'express';
import { scrapeResult } from '../lib/scrape';

const router = Router();

// // Middleware for validating the X-IDENTITY-KEY header
// router.use((req: Request, res: Response, next: NextFunction) => {
//     const requiredHeaderKey = "X-IDENTITY-KEY";
//     const requiredHeaderValue = process.env.IDENTITY_KEY;

//     if (req.headers[requiredHeaderKey.toLowerCase()] === requiredHeaderValue) {
//         next();
//     } else {
//         res.status(403).json({ error: 'Forbidden - Invalid or missing header' });
//     }
// });

// Endpoint to get result by rollNo scraped from the website
router.post('/result/:rollNo', async (req: Request, res: Response) => {
    const rollNo = req.params.rollNo;
    const data = await scrapeResult(rollNo);

    res.json(data);
});

export default router;
