"use server";
import dbConnect from "src/lib/dbConnect";
import UserModel from "src/models/user";

// Function to count users and calculate percent growth
export async function users_CountAndGrowth(timeInterval: string): Promise<{ count: number; growth: number; trend: 'increase' | 'decrease' | 'stable' }> {
    await dbConnect();
    let startTime: Date;

    switch (timeInterval) {
        case 'last_hour':
            startTime = new Date(Date.now() - (60 * 60 * 1000));
            break;
        case 'last_24_hours':
            startTime = new Date(Date.now() - (24 * 60 * 60 * 1000));
            break;
        case 'this_week':
            const today = new Date();
            const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
            startTime = startOfWeek;
            break;
        case 'this_month':
            const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
            startTime = startOfMonth;
            break;
        case 'this_year':
            const startOfYear = new Date(new Date().getFullYear(), 0, 1);
            startTime = startOfYear;
            break;
        default:
            throw new Error('Invalid time interval provided');
    }

    const count = await UserModel.countDocuments({  });
    // const count = await UserModel.countDocuments({ createdAt: { $gte: startTime } });

    const prevTimeIntervalStartTime = new Date(startTime.getTime());
    prevTimeIntervalStartTime.setFullYear(prevTimeIntervalStartTime.getFullYear() - 1); // Assuming yearly comparison for growth

    const prevCount = await UserModel.countDocuments({ createdAt: { $gte: prevTimeIntervalStartTime, $lt: startTime } });

    // Corrected calculation for growth
    const growth = prevCount === 0 ? 100 : ((count - prevCount) / prevCount) * 100;
    // Determine trend
    let trend: 'increase' | 'decrease' | 'stable' = 'stable';
    if (growth > 0) {
        trend = 'increase';
    } else if (growth < 0) {
        trend = 'decrease';
    }

    return { count, growth, trend };
}
