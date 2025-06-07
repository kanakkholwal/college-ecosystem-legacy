import { PipelineStage } from "mongoose";

const assignRank: PipelineStage[] = [
    {
        $set: {
            latestCgpi: {
                $let: {
                    vars: { lastSem: { $arrayElemAt: ["$semesters", -1] } },
                    in: "$$lastSem.cgpi"
                }
            }
        }
    },
    { $sort: { latestCgpi: -1 } },
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
    { $unset: ["latestSemester", "latestCgpi"] },
    {
        $merge: {
            into: "results",
            whenMatched: "merge",
            whenNotMatched: "discard",
        },
    },
];
const abnormalResults: PipelineStage[] = [
    {
        $match: {
            semesters: { $type: "array" },
        },
    },
    {
        $addFields: {
            semesterCount: { $size: "$semesters" },
        },
    },
    {
        $group: {
            _id: { programme: "$programme", batch: "$batch" },
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
            programme: 1,
            batch: 1,
            semesterCount: 1,
            avgSemesterCount: 1,
        },
    },
]
export const pipelines = {
    "abnormal-results": abnormalResults,
    "assign-rank": assignRank,
} as const;