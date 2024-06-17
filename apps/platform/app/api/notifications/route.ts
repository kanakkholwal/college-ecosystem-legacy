import { NextRequest, NextResponse } from "next/server";
import { getSession } from "src/lib/auth";
import dbConnect from "src/lib/dbConnect";
import Announcement from "src/models/announcement";
import AttendanceRecord from "src/models/attendance-record";
import Poll from "src/models/poll";

export async function GET(request: NextRequest) {
    try {

        const session = await getSession();
        // check if the user is authenticated;
        if (!session?.user) {
            return NextResponse.json([{
                result: "fail",
                message: "Unauthorized access.",
            }], {
                status: 401
            })
        }
        const notifications = new Array();

        await dbConnect();

        //  check if there is any popular polls with votes more than 50, created in the last 24 hours;
        const polls = await Poll.find({
            'votes': { $exists: true, $not: { $size: 0 } },
            createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        }).sort({ 'votes': -1 }).limit(5);
        if (polls.length > 0) {
            notifications.push({
                type: "poll",
                title: "You have new polls to participate in.",
                body: "Participate in the polls to share your opinion.",
                url: "/polls"
            });
        }
        // check if there is any new announcement created in the last 24 hours;
        const announcements = await Announcement.find({
            createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        }).sort({ createdAt: -1 }).limit(5);
        if (announcements.length > 0) {
            notifications.push({
                type: "announcement",
                title: "You have new announcements to check out.",
                body: "Check out the latest announcements to stay updated.",
                url: "/announcements"
            });
        }
        //  check if the session user has attendance lesss than 75% in any subject;
        const attendanceRecords = await AttendanceRecord.find({
            userId: session.user._id
        });
        let lowAttendance = attendanceRecords.filter(record => {
            const totalClasses = record.totalClasses;
            const presentClasses = record.attendance.filter((a: any) => a.isPresent).length;
            const attendancePercentage = (presentClasses / totalClasses) * 100;
            return attendancePercentage < 75;
        });
        if (lowAttendance.length > 0) {
            notifications.push({
                type: "attendance",
                title: "You have low attendance in some subjects.",
                body: "You have attendance less than 75% in some subjects.",
                url: "/attendance"
            });
        }

        return NextResponse.json(notifications, {
            status: 200
        })
    }
    catch (error: any) {
        return NextResponse.json({
            result: "fail",
            message: error.message,
        }, {
            status: 500
        })
    }


}
