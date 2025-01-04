import type { Request, Response } from 'express';
import type { PipelineStage } from 'mongoose';
import { z } from 'zod';
import { getInfoFromRollNo, scrapeResult } from '../lib/scrape';
import ResultModel from '../models/result';
import dbConnect from '../utils/dbConnect';




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

// Endpoint to add result by rollNo from the from site to the database
export const addResult = async (req: Request, res: Response) => {
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

export const updateResult = async (req: Request, res: Response) => {
    const rollNo = req.params.rollNo;

    try{
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
        const data = await scrapeResult(rollNo);
        if (data?.error || !data.data) {
            res.json(data);
            return;
        }
        const result = data.data;
        resultData.name = result.name;
        resultData.branch = result.branch;
        resultData.batch = result.batch;
        resultData.programme = result.programme;
        resultData.semesters = result.semesters;
        await resultData.save();
        console.log("Updated ", rollNo);
        res.json({
            data: resultData,
            message: "Result updated successfully",
            error: false,
        });
    } catch (error) {
        console.log(error);
        res.json({
            message: "An error occurred",
            error: true,
            data: error || "Internal Server Error"
        });
        
    }
    
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

const freshersDataSchema = z.array(z.object({
    name: z.string(),
    rollNo: z.string(),
    gender: z.enum(["male","female","not_specified"]),
}))

export async function importFreshers(req: Request, res: Response){
    try{
        const time = new Date();
        await dbConnect();

        const data = req.body;
        const parsedData = freshersDataSchema.safeParse(data);
        if(!parsedData.success){
            return res.status(400).json({
                error: true,
                message: "Invalid data",
                data: parsedData.error
            });
        }
        const results = parsedData.data.map(async(student) => {
            const data = await getInfoFromRollNo(student.rollNo);
            return {
                name: student.name,
                rollNo: student.rollNo,
                branch: data.branch,
                batch: data.batch,
                programme:data.programme,
                gender:student.gender,
                semesters: []
            }
        })

        const resultsWithRanks = await ResultModel.insertMany(results);

        console.log("Freshers imported successfully.");

        return res.status(200).json({
            error: false,
            message: "Freshers imported successfully.",
            data: {
                timeTaken: `${(new Date().getTime() - time.getTime()) / 1000}s`,
                lastUpdated: new Date().toISOString(),
                results: `${resultsWithRanks.length} freshers imported`
            }
        });

    }catch(error){
        console.log(error);
        return Promise.resolve({
            error: true,
            message: "An error occurred",
            data: error || "Internal Server Error"
        });
    }
}
