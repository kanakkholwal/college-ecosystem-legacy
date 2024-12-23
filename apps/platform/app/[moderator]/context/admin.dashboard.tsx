import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { CircleDashed, TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";

import { users_CountAndGrowth } from "~/actions/dashboard.admin";

export default async function AdminDashboard() {
  const {
    count: userCount,
    growth: userGrowth,
    trend: userTrend,
  } = await users_CountAndGrowth("this_month");

  return (
    <div className="space-y-6 my-5">
      <div className="flex justify-between gap-2 w-full flex-col lg:flex-row">
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Card variant="glass">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <title>Users</title>
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <h4 className="text-3xl font-bold text-primary">{userCount}</h4>
                <p className="text-xs text-muted-foreground">
                  <span
                    className={
                      `${userTrend === "increase"
                        ? "text-green-500"
                        : userTrend === "decrease"
                          ? "text-red-500"
                          : "text-primary/80"} text-base`
                    }
                  >
                    {userTrend === "increase" ? (
                      <TrendingUp className="inline-block mr-2 size-4" />
                    ) : userTrend === "decrease" ? (
                      <TrendingDown className="inline-block mr-2 size-4" />
                    ) : (
                      <CircleDashed className="inline-block mr-2 size-4" />
                    )}
                    {userGrowth?.toFixed(2)}%
                  </span> from last month
                </p>
              </CardContent>
            </Card>

          </div>
        </div>
        <div className="lg:w-1/3 p-3">
          {/* messages */}
          <h3 className="text-2xl font-semibold mb-2">Messages</h3>
          <div className="bg-white dark:bg-slate-800 px-4 py-10 rounded-lg text-center w-full">
            <p className="text-slate-600 dark:text-slate-400 mb-3">
              You have no new messages.
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              <Link
                href="/admin/messages"
                className="text-primary hover:underline"
              >
                View all messages
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
