"use server";
import type { InferSelectModel } from "drizzle-orm";
import { and, asc, desc, eq, like, sql } from "drizzle-orm";
import { db } from "~/db/connect";
import { accounts, sessions, users } from "~/db/schema/auth-schema";

export async function users_CountAndGrowth(timeInterval: string): Promise<{
  count: number;
  total: number;
  growth: number;
  trend: "increase" | "decrease" | "stable";
}> {
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

  const totalUsers = await db.select({ count: sql<number>`COUNT(*)` }).from(users).execute();
  const total = totalUsers[0]?.count ?? 0;

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
  const prevCount = prevCountQuery[0]?.count || 0;

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

  return {
    count: currentCount === Number.POSITIVE_INFINITY ? 100 : currentCount,
    total,
    growth,
    trend,
  };
}

// Infer the User model from the schema
type User = InferSelectModel<typeof users>;

type UserSortField = keyof Pick<
  User,
  "createdAt" | "updatedAt" | "name" | "username"
>;

interface UserListOptions {
  sortBy?: UserSortField; // Restrict sortBy to valid fields
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
  searchQuery?: string;
}

export async function listUsers(options: UserListOptions): Promise<User[]> {
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
    .where(eq(users.id, userId)) // Fetch the user by their ID
    .limit(1) // Limit to 1 result since ID is unique
    .execute();

  return user.length > 0 ? user[0] : null; // Return the first user or null if not found
}

/**
 * User Statistics Functions
 */
export async function getTotalUsers(): Promise<number> {
  const result = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(users)
    .execute();
  return result[0]?.count ?? 0;
}

export async function getUsersByRole(): Promise<
  { role: string; count: number }[]
> {
  const result = await db
    .select({
      role: users.role,
      count: sql<number>`COUNT(*)`,
    })
    .from(users)
    .groupBy(users.role)
    .execute();
  return result;
}

export async function getUsersByDepartment(): Promise<
  { department: string; count: number }[]
> {
  const result = await db
    .select({
      department: users.department,
      count: sql<number>`COUNT(*)`,
    })
    .from(users)
    .groupBy(users.department)
    .execute();
  return result;
}

export async function getUsersByGender(): Promise<
  { gender: string; count: number }[]
> {
  const result = await db
    .select({
      gender: users.gender,
      count: sql<number>`COUNT(*)`,
    })
    .from(users)
    .groupBy(users.gender)
    .execute();
  return result;
}

/**
 * Session Statistics Functions
 */

export async function getActiveSessions(): Promise<number> {
  const currentTime = new Date();
  const result = await db
    .select({ count: sql<number>`COUNT(DISTINCT "userId")` })
    .from(sessions)
    .where(sql`"expiresAt" > ${currentTime}`)
    .execute();
  return result[0]?.count ?? 0;
}
export async function getSessionsByUserAgent(): Promise<
  { userAgent: string; count: number }[]
> {
  const result = await db
    .select({
      userAgent: sql<string>`COALESCE(${sessions.userAgent}, 'Unknown')`,
      count: sql<number>`COUNT(*)`,
    })
    .from(sessions)
    .groupBy(sessions.userAgent)
    .execute();
  return result;
}

export async function getTotalAccounts(): Promise<number> {

  const result = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(accounts)
    .execute();
  return result[0]?.count ?? 0;
}




// Users with the most sessions
export async function mostSessionsUsers(): Promise<{ userId: string; sessionCount: number }[]> {
  const result = await db
    .select({
      userId: sessions.userId,
      sessionCount: sql<number>`COUNT(*)`,
    })
    .from(sessions)
    .groupBy(sessions.userId)
    .orderBy(desc(sql`COUNT(*)`))
    .execute();
  return result;
}

// Average session duration
export async function averageSessionDuration(): Promise<number | null> {
  const result = await db
    .select({
      avgDuration: sql<number>`AVG(EXTRACT(EPOCH FROM ("expiresAt" - "createdAt")))`,
    })
    .from(sessions)
    .execute();
  return result[0]?.avgDuration ?? null;
}

// Sessions by user (most/least active users)
export async function sessionActivity(): Promise<{
  mostActive: { userId: string; sessionCount: number } | null;
  leastActive: { userId: string; sessionCount: number } | null;
}> {
  const result = await db
    .select({
      userId: sessions.userId,
      sessionCount: sql<number>`COUNT(*)`,
    })
    .from(sessions)
    .groupBy(sessions.userId)
    .orderBy(desc(sql`COUNT(*)`), asc(sql`COUNT(*)`))
    .execute();

  return {
    mostActive: result[0] ?? null,
    leastActive: result[result.length - 1] ?? null,
  };
}

// Total user growth over time
export async function userGrowthOverTime(): Promise<{ date: string; count: number }[]> {
  const result = await db
    .select({
      date: sql<string>`DATE_TRUNC('month', "createdAt")`.as("date"),
      count: sql<number>`COUNT(*)`,
    })
    .from(users)
    .groupBy(sql`DATE_TRUNC('month', "createdAt")`)
    .orderBy(desc(sql`DATE_TRUNC('month', "createdAt")`))
    .execute();
  return result;
}

// Session trends (new vs recurring)
export async function sessionTrends(): Promise<{
  newSessions: number;
  recurringSessions: number;
}> {
  const newSessions = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(sessions)
    .where(sql`"userId" NOT IN (SELECT DISTINCT "userId" FROM ${sessions})`)
    .execute();

  const recurringSessions = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(sessions)
    .where(sql`"userId" IN (SELECT DISTINCT "userId" FROM ${sessions})`)
    .execute();

  return {
    newSessions: newSessions[0]?.count ?? 0,
    recurringSessions: recurringSessions[0]?.count ?? 0,
  };
}

// External account usage patterns
export async function externalAccountPatterns(): Promise<
  { providerId: string; count: number }[]
> {
  const result = await db
    .select({
      providerId: accounts.providerId,
      count: sql<number>`COUNT(*)`,
    })
    .from(accounts)
    .groupBy(accounts.providerId)
    .orderBy(desc(sql`COUNT(*)`))
    .execute();
  return result;
}

// Engagement trends
export async function userEngagement(): Promise<{
  highestEngagement: { userId: string; sessionCount: number } | null;
  lowestEngagement: { userId: string; sessionCount: number } | null;
}> {
  const result = await db
    .select({
      userId: sessions.userId,
      sessionCount: sql<number>`COUNT(*)`,
    })
    .from(sessions)
    .groupBy(sessions.userId)
    .orderBy(desc(sql`COUNT(*)`), asc(sql`COUNT(*)`))
    .execute();

  return {
    highestEngagement: result[0] ?? null,
    lowestEngagement: result[result.length - 1] ?? null,
  };
}

// Department-wise or role-wise engagement
export async function departmentWiseEngagement(): Promise<
  { department: string; sessionCount: number }[]
> {
  const result = await db
    .select({
      department: users.department,
      sessionCount: sql<number>`COUNT(${sessions.id})`,
    })
    .from(users)
    .leftJoin(sessions, eq(users.id, sessions.userId))
    .groupBy(users.department)
    .orderBy(desc(sql`COUNT(${sessions.id})`))
    .execute();
  return result;
}
