import type { Request, Response } from "express";
import { z } from "zod";
import { scrapeAndSaveResult } from "../lib/result_utils";
import { getDepartmentCoursePrefix, isValidRollNumber } from "../constants/departments";
import { pipelines } from "../constants/pipelines";
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


    // Execute the aggregation pipeline
    const results = await ResultModel.aggregate(pipelines["abnormal-results"]);
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
export const deleteAbNormalResults = async (req: Request, res: Response) => {
  try {
    await dbConnect();


    // Execute the aggregation pipeline
    const results = await ResultModel.aggregate(pipelines["abnormal-results"]);
    if (results.length === 0) {
      res.status(404).json({
        error: true,
        message: "No abnormal results found",
        data: null,
      });
      return;
    }
    const abnormalIds = results.map((result) => result._id);
    const deleteResult = await ResultModel.deleteMany({
      _id: { $in: abnormalIds },
    });
    if (deleteResult.deletedCount === 0) {
      res.status(404).json({
        error: true,
        message: "No abnormal results found to delete",
        data: null,
      });
      return;
    }
    console.log(`Deleted ${deleteResult.deletedCount} abnormal results`);
    // Return the deleted results
    res.status(200).json({
      error: false,
      message: `Deleted ${deleteResult.deletedCount} abnormal results`,
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


export const bulkUpdateResults = async (req: Request, res: Response) => {
  try {
    const rollNos = (req.body.rollNos || []) as string[];
    const validatedRollNos = rollNos.filter((rollNo) => isValidRollNumber(rollNo));
    if (validatedRollNos.length === 0) {
      res.status(400).json({
        error: true,
        message: "No valid roll numbers provided",
        data: null,
      }); return
    }
    const BATCH_SIZE = 8;
    const result = {
      total: validatedRollNos.length,
      updated: 0,
      errors: [] as string[],
    }
    for (let i = 0; i < validatedRollNos.length; i += BATCH_SIZE) {
      const batch = validatedRollNos.slice(i, i + BATCH_SIZE);
      const results = await Promise.allSettled(
        batch.map((rollNo) => scrapeAndSaveResult(rollNo))
      );
      results.forEach((res) => {
        if (res.status === "fulfilled") {
          result.updated += 1;
        } else {
          result.errors.push(res.reason ? res.reason : "Unknown error");
        }
      });
    }


    res.status(200).json({
      error: false,
      message: "Bulk update successful",
      data: result,
    });
    return;
  }
  catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "An error occurred",
      data: error || "Internal Server Error",
    });
    return;
  }
}
export const bulkDeleteResults = async (req: Request, res: Response) => {
  try {
    const rollNos = (req.body.rollNos || []) as string[];
    const validatedRollNos = rollNos.filter((rollNo) => isValidRollNumber(rollNo));
    if (validatedRollNos.length === 0) {
      res.status(400).json({
        error: true,
        message: "No valid roll numbers provided",
        data: null,
      });
      return
    }
    const result = await ResultModel.deleteMany({
      rollNo: { $in: validatedRollNos },
    });

    res.status(200).json({
      error: false,
      message: "Bulk delete successful",
      data: {
        deletedCount: result.deletedCount,
        acknowledged: result.acknowledged,
        rollNos: validatedRollNos,
      },
    });
    return
  }
  catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "An error occurred",
      data: error || "Internal Server Error",
    });
    return
  }
}
export const assignRankToResults = async (req: Request, res: Response) => {
  try {
    const time = new Date();
    await dbConnect();

    const resultsWithRanks = await ResultModel.aggregate(pipelines["assign-rank"])
      .allowDiskUse(true)



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
