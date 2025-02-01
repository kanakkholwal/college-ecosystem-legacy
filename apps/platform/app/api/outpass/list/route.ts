import { Types } from "mongoose";
import { type NextRequest, NextResponse } from "next/server";
import { getHostelByUser } from "~/actions/hostel";
import { OutPassModel } from "~/models/hostel_n_outpass";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = Number.parseInt(searchParams.get("page") || "1", 10);
        const limit = Number.parseInt(searchParams.get("limit") || "10", 10);
        const skip = (page - 1) * limit;

        const { success, message, hostel, inCharge } = await getHostelByUser(searchParams.get("slug") || undefined);

        if (!success || !hostel) {
            return new NextResponse(message, { status: 400 });
        }
        const hostelId = new Types.ObjectId(hostel._id); // Ensure ObjectId type
        const outPasses = await OutPassModel.find({ hostel: hostelId })
            .populate("hostel")
            .populate("student")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        // Total count for pagination
        const totalCount = await OutPassModel.countDocuments({ hostel: hostelId });

        // Group outpass by status
        // const groupedOutPasses: Record<string, OutPassType[]> = {};
        // for (const outPass of outPasses) {
        //     if (!groupedOutPasses[outPass.status]) {
        //         groupedOutPasses[outPass.status] = [];
        //     }
        //     groupedOutPasses[outPass.status].push(outPass);
        // }

        const groupedOutPasses = Object.groupBy(outPasses, ({ status }) => status);


        return NextResponse.json(
            {
                totalPages: Math.ceil(totalCount / limit),
                currentPage: page,
                totalCount,
                groupedOutPasses
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error fetching outpass list:", error);
        return NextResponse.json(
            {
                hostel: "unknown",
                message: "An error occurred while fetching data",
                error: error?.toString() || "Something went wrong",
            },
            { status: 500 }
        );
    }
}
