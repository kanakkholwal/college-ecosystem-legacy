"use server";
import dbConnect from "src/lib/dbConnect";
import ResultModel,{ResultTypeWithId} from "src/models/result";

export async function getResultByRollNo(rollNo:string):Promise<ResultTypeWithId>{
    await dbConnect();
    const result = await ResultModel.findOne({
        rollNo
    }).exec();
    return JSON.parse(JSON.stringify(result));
}