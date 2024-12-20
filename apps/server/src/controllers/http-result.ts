import type { Request, Response } from 'express';
import ResultModel from '~/models/result';
import dbConnect from '~/utils/dbConnect';
import { scrapeResult } from '../lib/scrape';




// Endpoint to get result by rollNo scraped from the website
export const getResultByRollNoFromSite = async (req: Request, res: Response) => {
    const rollNo = req.params.rollNo;
    const data = await scrapeResult(rollNo);

    res.json(data);
}

// Endpoint to get result by rollNo from the database
export const addUpdateResult = async (req: Request, res: Response) => {
    const rollNo = req.params.rollNo;

    await dbConnect();

    const resultData = await ResultModel.findOne({ rollNo: rollNo });
    if (resultData) {
        res.json({
            data: resultData,
            message: "Result already exists",
            error: false,
        });
        return;
    }
    const data = await scrapeResult(rollNo);
    if (data?.error || !data.data) {
        res.json(data);
        return;
    }
    const result = data.data;
    const newResult = new ResultModel({
        rollNo: rollNo,
        name: result.name,
        branch: result.branch,
        batch: result.batch,
        programme: result.programme,
        semesters: result.semesters,
    });
    await newResult.save();
    console.log("Created ", rollNo);
    res.json({
        data: newResult,
        message: "Result added successfully",
        error: false,
    });
}

