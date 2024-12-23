import dbConnect from '../utils/dbConnect';
import { scrapeResult } from '../lib/scrape';
import ResultModel from "../models/result";


const LIST_TYPE = {
    ALL: "all",
    BACKLOG: "has_backlog",
    NEW_SEMESTER: "new_semester",
} as const

export type listType = typeof LIST_TYPE[keyof typeof LIST_TYPE]

export async function getListOfRollNos(list_type: listType) {
    let query = {};
    switch (list_type) {
        case LIST_TYPE.BACKLOG:
            query = { "semesters": { $elemMatch: { "courses": { $elemMatch: { "cgpi": { $lt: 4 } } } } } };
            break;
        case LIST_TYPE.NEW_SEMESTER:
            // has less than 8 semesters
            query = { $where: "this.semesters.length < 8" };
            break;
        // case LIST_TYPE.ALL:
        //     query = {};
        //     break;
        default:
            return [];
    }
    await dbConnect();
    const results = await ResultModel.find(query).select('rollNo updatedAt') as { rollNo: string, updatedAt: Date }[];
    return results;

}



export async function scrapeAndSaveResult(rollNo: string) {
    try{
        const result = await scrapeResult(rollNo);
        //  check if scraping was failed
        if (result.error || result.data === null) {
            return { rollNo, success: false };
        }
        // check if result already exists
        const existingResult = await ResultModel.findOne({ rollNo });
        if (existingResult) {
            existingResult.semesters = result.data.semesters;
            await existingResult.save();
            return { rollNo, success: true };
        }
        // create new result if not exists
        await ResultModel.create(result.data);
        return { rollNo, success: true };      
    }catch(e){
        if (e instanceof Error) {
            console.error(e.message);
        }
        return { rollNo, success: false };
    }
}