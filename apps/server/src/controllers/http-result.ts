import type { Request, Response } from 'express';
import type { PipelineStage } from 'mongoose';
import ResultModel from '~/models/result';
import dbConnect from '~/utils/dbConnect';
import { scrapeResult } from '../lib/scrape';




// Endpoint to get result by rollNo scraped from the website
export const getResultByRollNoFromSite = async (req: Request, res: Response) => {
    const rollNo = req.params.rollNo;
    const data = await scrapeResult(rollNo);

    res.json(data);
}
export const getResult = async (req: Request, res: Response) => {
    const rollNo = req.params.rollNo;
    await dbConnect();

    const resultData = await ResultModel.findOne({ rollNo: rollNo });
    if (!resultData) {
        res.json({
            message: "Result not found",
            error: true,
            data: null,
        });
        return;
    }
    res.json({
        data: resultData,
        message: "Result found",
        error: false,
    });
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

export async function assignRankToResults(req: Request, res: Response) {
    try {
        const time = new Date();
        await dbConnect();

        const aggregationPipeline = [
            {
                $set: {
                    latestSemester: { $arrayElemAt: ["$semesters", -1] },
                },
            },
            {
                $sort: { "latestSemester.cgpi": -1 },
            },
            {
                $group: {
                    _id: null,
                    results: { $push: "$$ROOT" },
                },
            },
            {
                $unwind: { path: "$results", includeArrayIndex: "collegeRank" },
            },
            {
                $set: {
                    "results.rank.college": { $add: ["$collegeRank", 1] },
                },
            },
            {
                $group: {
                    _id: "$results.batch",
                    results: { $push: "$results" },
                },
            },
            {
                $unwind: { path: "$results", includeArrayIndex: "batchRank" },
            },
            {
                $set: {
                    "results.rank.batch": { $add: ["$batchRank", 1] },
                },
            },
            {
                $group: {
                    _id: { batch: "$results.batch", branch: "$results.branch" },
                    results: { $push: "$results" },
                },
            },
            {
                $unwind: { path: "$results", includeArrayIndex: "branchRank" },
            },
            {
                $set: {
                    "results.rank.branch": { $add: ["$branchRank", 1] },
                },
            },
            {
                $group: {
                    _id: { batch: "$results.batch", branch: "$results.branch" },
                    results: { $push: "$results" },
                },
            },
            {
                $unwind: { path: "$results", includeArrayIndex: "classRank" },
            },
            {
                $set: {
                    "results.rank.class": { $add: ["$classRank", 1] },
                },
            },
            {
                $replaceRoot: { newRoot: "$results" },
            },
            // Remove the latestSemester field
            {
                $unset: "latestSemester",
            },
            {
                $merge: {
                    into: "results",
                    whenMatched: "merge",
                    whenNotMatched: "discard",
                },
            },
        ] as PipelineStage[];

        const resultsWithRanks = await ResultModel.aggregate(aggregationPipeline);

        await Promise.all(
            resultsWithRanks.map(async (result) => {
                const { _id, rank } = result;
                await ResultModel.findByIdAndUpdate(_id, { rank });
            })
        );

        console.log("Ranks assigned successfully.");

        return res.status(200).json({
            error: false,
            message: "Ranks assigned successfully.",
            data: {
                timeTaken: `${(new Date().getTime() - time.getTime()) / 1000}s`,
                lastUpdated: new Date().toISOString()
            }
        });
    } catch (error) {
        console.log(error);
        return Promise.resolve({
            error: true,
            message: "An error occurred",
            data: error || "Internal Server Error"
        });
    }
}

