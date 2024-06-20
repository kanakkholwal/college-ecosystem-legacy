import { NextRequest, NextResponse } from "next/server";
import dbConnect from "src/lib/dbConnect";
import ResultModel from "src/models/result";

export async function POST(request: NextRequest) {
  try {
    const time = new Date();
    await dbConnect("result");

    const aggregationPipeline = [
      {
        $addFields: {
          lastSemester: {
            $arrayElemAt: ["$semesters", -1],
          },
        },
      },
      {
        $sort: {
          "lastSemester.cgpi": -1,
        },
      },
      {
        $group: {
          _id: null,
          results: {
            $push: "$$ROOT",
          },
        },
      },
      {
        $unwind: "$results",
      },
      {
        $group: {
          _id: "$results._id",
          rank: {
            $first: "$results.rank",
          },
          collegeRank: {
            $first: "$results.rank.college",
          },
          batchRank: {
            $first: "$results.rank.batch",
          },
          branchRank: {
            $first: "$results.rank.branch",
          },
          classRank: {
            $first: "$results.rank.class",
          },
          data: {
            $first: "$results",
          },
        },
      },
      {
        $sort: {
          "data.lastSemester.cgpi": 1,
        },
      },
      {
        $group: {
          _id: null,
          results: {
            $push: "$$ROOT",
          },
        },
      },
      {
        $unwind: "$results",
      },
      {
        $project: {
          rank: "$results.rank",
        },
      },
    ] as unknown as any;

    const resultsWithRanks = await ResultModel.aggregate(aggregationPipeline);

    await Promise.all(
      resultsWithRanks.map(async (result) => {
        const { _id, rank } = result;
        await ResultModel.findByIdAndUpdate(_id, { rank });
      })
    );

    console.log("Ranks assigned successfully.");

    return NextResponse.json(
      {
        result: "success",
        message: "Ranks assigned successfully.",
        timeTake: (new Date().getTime() - time.getTime()) / 1000 + "s",
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        result: "fail",
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
