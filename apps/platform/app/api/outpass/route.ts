import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "~/lib/auth-server";
import {
    isValidRollNumber,
} from "~/constants/departments";
import {Types} from "mongoose";
import { ROLES } from "~/constants";
import dbConnect from "~/lib/dbConnect";
import { getOutPassHistoryByRollNo,getOutPassById } from "~/actions/hostel_outpass";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const identifier = searchParams.get('identifier')
        if (!identifier) {
            return new NextResponse("No identifier provided", { status: 400 });
        }
        const isValidRollNo = isValidRollNumber(identifier);
        const isValidMongoId = Types.ObjectId.isValid(identifier)
        if(!isValidRollNo && !isValidMongoId){
            return new NextResponse("Invalid identifier provided", { status: 400 });
        }
        const session = await getSession();
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if(session.user.role !== ROLES.ADMIN || !session.user.other_roles.includes(ROLES.GUARD)){
            return new NextResponse("You are not authorized to access this feature", { status: 403 });
        }
        await dbConnect();
        if(isValidRollNo){
            // Fetch outpass history by roll number
            const outpassHistory = await getOutPassHistoryByRollNo(identifier);
            return NextResponse.json({
                identifier:"rollNo",
                history: outpassHistory,
            }, { status: 200 });
        }
        // Fetch outpass by id
        if(isValidMongoId){
            const outpass = await getOutPassById(identifier);
            return NextResponse.json({
                identifier:"id",
                outpass,
            }, { status: 200 });
        }

        return NextResponse.json({
            identifier:"unknown",
            message:"Invalid identifier provided or no data found",
        }, { status: 400 });
        
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json(
            {
                identifier:"unknown",
                message:"An error occurred while fetching data",
                error: error?.toString() || "Something went wrong",
            },
            { status: 500 }
        );
    }
}
