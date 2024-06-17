"use server";
import dbConnect from "src/lib/dbConnect";
import ResultModel from "src/models/result";


export async function getResults(query: string, currentPage: number, filter: {
    branch?: string,
    programme?: string,
    batch?: number,
}) {
    await dbConnect();
    const resultsPerPage = 32;
    const skip = currentPage * resultsPerPage - resultsPerPage;

    const filterQuery = {
        $or: [
            { "rollNo": { $regex: query, $options: "i" } },
            { "name": { $regex: query, $options: "i" } },
        ],
    } as unknown as any;

    // Apply filters if provided and not equal to "all"
    if (filter.branch && filter.branch !== "all") {
        filterQuery["branch"] = filter.branch;
    }


    if (filter.programme && filter.programme !== "all") {
        filterQuery["programme"] = filter.programme;
    }


    if (filter.batch && filter.batch.toString() !== "all") {
        filterQuery["batch"] = filter.batch;
    }

    const results = await ResultModel.find(filterQuery)
        .sort({ "rank.college": "asc" })
        .skip(skip)
        .limit(resultsPerPage)
        .exec();

    const branches = await ResultModel.distinct("branch");
    const batches = await ResultModel.distinct("batch");
    const programmes = await ResultModel.distinct("programme");

    const totalPages = Math.ceil((await ResultModel.countDocuments(filterQuery)) / resultsPerPage);

    return { results, totalPages, branches, batches, programmes };
}
