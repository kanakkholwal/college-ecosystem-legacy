import type { Request, Response } from "express";
import type { PipelineStage } from "mongoose";
import { z } from "zod";
import { getDepartmentCoursePrefix } from "../constants/departments";
import { getInfoFromRollNo, scrapeResult } from "../lib/scrape";
import ResultModel from "../models/result";
import { rawResultSchema } from "../types/result";
import dbConnect from "../utils/dbConnect";

// Endpoint to get result by rollNo scraped from the website
export const getResultByRollNoFromSite = async (
  req: Request,
  res: Response
) => {
  const rollNo = req.params.rollNo;
  const data = await scrapeResult(rollNo);

  res.status(200).json(data);
};

export const getResult = async (req: Request, res: Response) => {
  const rollNo = req.params.rollNo;
  await dbConnect();

  const resultData = await ResultModel.findOne({ rollNo: rollNo });
  if (!resultData) {
    res.status(404).json({
      message: "Result not found",
      error: true,
      data: null,
    });
    return;
  }
  res.status(200).json({
    data: resultData,
    message: "Result found",
    error: false,
  });
};

// Endpoint to add result by rollNo from the from site to the database
export const addResult = async (req: Request, res: Response) => {
  const rollNo = req.params.rollNo;

  await dbConnect();

  const resultData = await ResultModel.findOne({ rollNo: rollNo });
  if (resultData) {
    res.status(200).json({
      data: resultData,
      message: "Result already exists",
      error: false,
    });
    return;
  }
  const data = await scrapeResult(rollNo);
  if (data?.error || !data.data) {
    res.status(500).json(data);
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
  res.status(201).json({
    data: newResult,
    message: "Result added successfully",
    error: false,
  });
  return;
};

export const updateResult = async (req: Request, res: Response) => {
  const rollNo = req.params.rollNo;
  const custom_attributes = rawResultSchema.partial().safeParse(req.body);
  if (!custom_attributes.success) {
    res.status(400).json({
      message: "Invalid custom attributes",
      error: true,
      data: custom_attributes.error.errors,
    });
    return;
  }
  const valid_custom_attributes = custom_attributes.data;

  try {
    await dbConnect();

    const resultData = await ResultModel.findOne({ rollNo: rollNo });
    if (!resultData) {
      res.status(404).json({
        message: "Result not found",
        error: true,
        data: null,
      });
      return;
    }
    const data = await scrapeResult(rollNo);
    if (data?.error || !data.data) {
      res.status(500).json(data);
      return;
    }
    const result = data.data;
    await ResultModel.findByIdAndUpdate(resultData._id, {
      $set: {
        name: result.name,
        branch: result.branch,
        batch: result.batch,
        programme: result.programme,
        semesters: result.semesters,
        ...(valid_custom_attributes ? { ...valid_custom_attributes } : {}),
      },
    });
    await resultData.save();
    console.log("Updated ", rollNo);
    res.status(200).json({
      data: resultData,
      message: "Result updated successfully",
      error: false,
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred",
      error: true,
      data: error || "Internal Server Error",
    });
    return;
  }
};
export const deleteResult = async (req: Request, res: Response) => {
  const rollNo = req.params.rollNo;
  await dbConnect();

  const resultData = await ResultModel.deleteOne({ rollNo: rollNo });
  if (resultData.deletedCount === 0) {
    res.status(200).json({
      message: "Result not found",
      error: true,
      data: null,
    });
    return;
  }
  res.status(200).json({
    data: resultData,
    message: "Result deleted successfully",
    error: false,
  });
  return;
};


export const getAbnormalResults = async (req: Request, res: Response) => {
  try {
    await dbConnect();
    const pipeline = [
  {
    $addFields: {
      semesterCount: { $size: "$semesters" },
    },
  },
  {
    $group: {
      _id: "$batch",
      avgSemesterCount: { $avg: "$semesterCount" },
      docs: { $push: "$$ROOT" },
    },
  },
  {
    $unwind: "$docs",
  },
  {
    $replaceRoot: {
      newRoot: {
        $mergeObjects: ["$docs", { avgSemesterCount: "$avgSemesterCount" }],
      },
    },
  },
  {
    $addFields: {
      diff: { $abs: { $subtract: ["$semesterCount", "$avgSemesterCount"] } },
    },
  },
  {
    $match: {
      diff: { $gte: 2 },
    },
  },
  {
    $project: {
      name: 1,
      rollNo: 1,
      branch: 1,
      batch: 1,
      semesterCount: 1,
      avgSemesterCount: 1,
    },
  },
];

const results = await ResultModel.aggregate(pipeline);
    res.status(200).json({
      error: false,
      message: "Abnormal results fetched successfully",
      data: results,
    });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "An error occurred",
      data: error || "Internal Server Error",
    });
  }
};
export const assignRankToResults = async (req: Request, res: Response) => {
  try {
    const time = new Date();
    await dbConnect();

    const aggregationPipeline: PipelineStage[] = [
      { $set: { latestSemester: { $arrayElemAt: ["$semesters", -1] } } },
      { $sort: { "latestSemester.cgpi": -1 } },
      { $group: { _id: null, results: { $push: "$$ROOT" } } },
      { $unwind: { path: "$results", includeArrayIndex: "collegeRank" } },
      { $set: { "results.rank.college": { $add: ["$collegeRank", 1] } } },
      { $group: { _id: "$results.batch", results: { $push: "$results" } } },
      { $unwind: { path: "$results", includeArrayIndex: "batchRank" } },
      { $set: { "results.rank.batch": { $add: ["$batchRank", 1] } } },
      {
        $group: {
          _id: { batch: "$results.batch", branch: "$results.branch" },
          results: { $push: "$results" },
        },
      },
      { $unwind: { path: "$results", includeArrayIndex: "branchRank" } },
      { $set: { "results.rank.branch": { $add: ["$branchRank", 1] } } },
      {
        $group: {
          _id: { batch: "$results.batch", branch: "$results.branch" },
          results: { $push: "$results" },
        },
      },
      { $unwind: { path: "$results", includeArrayIndex: "classRank" } },
      { $set: { "results.rank.class": { $add: ["$classRank", 1] } } },
      { $replaceRoot: { newRoot: "$results" } },
      { $unset: "latestSemester" },
      {
        $merge: {
          into: "results",
          whenMatched: "merge",
          whenNotMatched: "discard",
        },
      },
    ];

    const resultsWithRanks = await ResultModel.aggregate(aggregationPipeline);

    await Promise.all(
      resultsWithRanks.map(async (result) => {
        const { _id, rank } = result;
        await ResultModel.findByIdAndUpdate(_id, { rank });
      })
    );

    res.status(200).json({
      error: false,
      message: "Ranks assigned successfully.",
      data: {
        timeTaken: `${(new Date().getTime() - time.getTime()) / 1000}s`,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "An error occurred",
      data: error || "Internal Server Error",
    });
  }
};

export const assignBranchChangeToResults = async (
  req: Request,
  res: Response
) => {
  try {
    const startTime = new Date();
    await dbConnect();

    // Aggregation pipeline to handle processing in MongoDB
    const pipeline = [
      {
        $project: {
          _id: 1,
          rollNo: 1,
          branch: 1,
          semesters: { $slice: ["$semesters", 2, { $size: "$semesters" }] },
        },
      },
      {
        $addFields: {
          courseCodes: {
            $reduce: {
              input: "$semesters",
              initialValue: [],
              in: { $concatArrays: ["$$value", "$$this.courses.code"] },
            },
          },
        },
      },
      {
        $addFields: {
          uniquePrefixes: {
            $map: {
              input: { $setUnion: "$courseCodes" },
              as: "code",
              in: { $toUpper: { $split: ["$$code", "-"][0] } },
            },
          },
        },
      },
      {
        $unset: ["semesters", "courseCodes"], // Remove intermediate fields to avoid schema changes
      },
    ];

    const results = await ResultModel.aggregate(pipeline);

    // Prepare bulk operations
    const bulkOperations = results.map((result) => {
      const courseCount: { [key: string]: number } =
        result.uniquePrefixes.reduce(
          (acc: { [key: string]: number }, prefix: string) => {
            acc[prefix] =
              (acc[prefix] || 0) +
              result.uniquePrefixes.filter((p: string) => p === prefix).length;
            return acc;
          },
          {}
        );

      const maxCourses = Math.max(...(Object.values(courseCount) as number[]));
      const maxPrefix = Object.keys(courseCount).find(
        (prefix) => courseCount[prefix] === maxCourses
      );
      const department = getDepartmentCoursePrefix(maxPrefix || "");

      const updates = {
        gender:
          result.gender !== "not_specified" ? result.gender : "not_specified",
        branch: result.branch,
      };
      if (
        department &&
        department !== "other" &&
        department !== result.branch
      ) {
        updates.branch = department;
        console.log(`Branch change detected for ${result.rollNo}`);
      }

      return {
        updateOne: {
          filter: { _id: result._id },
          update: updates,
        },
      };
    });

    // Execute bulk write to minimize database calls
    if (bulkOperations.length > 0) {
      await ResultModel.bulkWrite(bulkOperations);
    }
    await ResultModel.aggregate([
      { $unset: "latestSemester" },
      // { $merge: { into: 'results', whenMatched: 'merge', whenNotMatched: 'discard' } }
    ]);

    return res.status(200).json({
      error: false,
      message: "Branch change script executed successfully",
      data: {
        timeTaken: `${(new Date().getTime() - startTime.getTime()) / 1000}s`,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "An error occurred",
      data: error || "Internal Server Error",
    });
  }
};

const freshersDataSchema = z.array(
  z.object({
    name: z.string(),
    rollNo: z.string(),
    gender: z.enum(["male", "female", "not_specified"]),
  })
);

export const importFreshers = async (req: Request, res: Response) => {
  try {
    const time = new Date();
    await dbConnect();

    const data = req.body;
    const parsedData = freshersDataSchema.safeParse(data);

    if (!parsedData.success) {
      return res.status(400).json({
        error: true,
        message: "Invalid data",
        data: parsedData.error.errors,
      });
    }

    const results = await Promise.all(
      parsedData.data.map(async (student) => {
        const data = await getInfoFromRollNo(student.rollNo);
        return {
          name: student.name,
          rollNo: student.rollNo,
          branch: data.branch,
          batch: data.batch,
          programme: data.programme,
          gender: student.gender,
          semesters: [],
        };
      })
    );

    const resultsWithRanks = await ResultModel.insertMany(results);

    return res.status(200).json({
      error: false,
      message: "Freshers imported successfully.",
      data: {
        timeTaken: `${(new Date().getTime() - time.getTime()) / 1000}s`,
        lastUpdated: new Date().toISOString(),
        results: `${resultsWithRanks.length} freshers imported`,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "An error occurred",
      data: error || "Internal Server Error",
    });
  }
};
