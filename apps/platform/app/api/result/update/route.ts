import { NextRequest, NextResponse } from "next/server";
import { ScrapeResult } from 'src/controllers/scraper';
import dbConnect from "src/lib/dbConnect";
import Result from "src/models/result";
export async function POST(request: NextRequest) {
    try {
        const time = new Date()
        const rollNo = request.nextUrl.searchParams.get('rollNo') as string;
        console.log(rollNo)
        if(!rollNo) return NextResponse.json({
            result: "fail",
            message: "Roll No not found",
        },{
            status:404
        })
        const result = await ScrapeResult(rollNo);
        // console.table(result)

        await dbConnect("result");
        const resultData = await Result.findOne({ rollNo: rollNo });
        if (resultData) {
            // if (result.semesters.length > resultData.semesters.length) {
                resultData.semesters = result.semesters;
                await resultData.save();
            //     console.log("Updated ", rollNo)
            // } else {
            //     console.log("Up to date ", rollNo)
            // }
        }
        else {
            return NextResponse.json({
                result: "fail",
                message: "Result not found",
                rollNo: rollNo,
                createdAt: time,
                updatedAt: new Date(),
                data: result
            },{
                status:404
            })
        }
    
        return NextResponse.json({
            result: "success",
            message: "Result updated",
            rollNo: rollNo,
            createdAt: time,
            updatedAt: new Date(),
            data: result
        },{
            status:200
        })
    }
    catch (error:any) {
        return NextResponse.json({
            result: "fail",
            message: error.message,
        },{
            status:500
        })
    }


}
