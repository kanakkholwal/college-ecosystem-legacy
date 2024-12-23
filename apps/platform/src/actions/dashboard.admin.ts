import { and, asc, desc, like, sql,eq } from "drizzle-orm";
import { db } from "~/db/connect";
import { users } from "~/db/schema/auth-schema";
import type { InferSelectModel } from "drizzle-orm";

export async function users_CountAndGrowth(
    timeInterval: string
): Promise<{
    count: number;
    growth: number;
    trend: "increase" | "decrease" | "stable";
}> {
    "use server"
    let startTime: Date;

    // Determine the start time based on the time interval
    switch (timeInterval) {
        case "last_hour":
            startTime = new Date(Date.now() - 60 * 60 * 1000);
            break;
        case "last_24_hours":
            startTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
            break;
        case "this_week": {
            const today = new Date();
            const startOfWeek = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() - today.getDay()
            );
            startTime = startOfWeek;
            break;
        }
        case "this_month":
            startTime = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
            break;
        case "this_year":
            startTime = new Date(new Date().getFullYear(), 0, 1);
            break;
        default:
            throw new Error("Invalid time interval provided");
    }

    // Fetch the count of users from the current interval
    const currentCountQuery = await db
        .select({
            count: sql<number>`COUNT(*)`,
        })
        .from(users)
        .where(sql`"createdAt" >= ${startTime}`);
    const currentCount = currentCountQuery[0]?.count ?? 0;

    // Fetch the count of users from the previous interval
    const prevStartTime = new Date(startTime.getTime());
    prevStartTime.setFullYear(prevStartTime.getFullYear() - 1); // Assuming yearly comparison for growth
    const prevCountQuery = await db
        .select({
            count: sql<number>`COUNT(*)`,
        })
        .from(users)
        .where(sql`"createdAt" >= ${prevStartTime} AND "createdAt" < ${startTime}`);
    const prevCount = prevCountQuery[0]?.count ?? 0;

    // Calculate growth percentage
    const growth =
        prevCount === 0 ? 100 : ((currentCount - prevCount) / prevCount) * 100;

    // Determine trend
    let trend: "increase" | "decrease" | "stable" = "stable";
    if (growth > 0) {
        trend = "increase";
    } else if (growth < 0) {
        trend = "decrease";
    }

    return { count: currentCount, growth, trend };
}



// Infer the User model from the schema
type User = InferSelectModel<typeof users>;

type UserSortField = keyof Pick<User, "createdAt" | "updatedAt" | "name" | "username">;

interface UserListOptions {
    sortBy?: UserSortField; // Restrict sortBy to valid fields
    sortOrder?: "asc" | "desc";
    limit?: number;
    offset?: number;
    searchQuery?: string;
}

export async function listUsers(options: UserListOptions): Promise<User[]> {
    "use server"
    const {
        sortBy = "createdAt", // Default sort field
        sortOrder = "desc", // Default sort order
        limit = 10,
        offset = 0,
        searchQuery,
    } = options;

    const order = sortOrder === "desc" ? desc : asc;

    const conditions = [];

    // Add search condition for name or username
    if (searchQuery) {
        conditions.push(
            like(users.name, `%${searchQuery}%`),
            like(users.username, `%${searchQuery}%`)
        );
    }

    const query = db
        .select()
        .from(users)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(order(users[sortBy]))
        .limit(limit)
        .offset(offset);

    const results = await query;
    return results;
}


export async function getUser(userId: string): Promise<User | null> {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id,userId)) // Fetch the user by their ID
    .limit(1) // Limit to 1 result since ID is unique
    .execute();

  return user.length > 0 ? user[0] : null; // Return the first user or null if not found
}
