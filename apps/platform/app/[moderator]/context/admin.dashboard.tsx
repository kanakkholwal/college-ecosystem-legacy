import { ActionBar } from "@/components/application/action-bar";
import { StatsCard } from "@/components/application/stats-card";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/typography";
import { CircleDashed, Eye, TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";
import { FaGenderless } from "react-icons/fa";
import { TbUsersGroup } from "react-icons/tb";
import {
  flushCache,
  getActiveSessions,
  getUsersByDepartment,
  getUsersByGender,
  getUsersByRole,
  users_CountAndGrowth,
} from "~/actions/dashboard.admin";

export default async function AdminDashboard() {
  const {
    total: totalUsers,
    growthPercent: userGrowth,
    growth,
    trend: userTrend,
  } = await users_CountAndGrowth("last_week");

  const usersByGender = await getUsersByGender();
  const usersByRole = await getUsersByRole();
  const usersByDepartment = await getUsersByDepartment();
  const activeSessions = await getActiveSessions();

  return (
    <div className="space-y-6 my-5">
      <div className="flex justify-between gap-2 w-full flex-col @4xl:flex-row divide-y @4xl:divide-x divide-gray-200">
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Total Users Card */}

            <StatsCard
              title="Total Users"
              Icon={
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
              }
            >
              <h4 className="text-3xl font-bold text-primary">
                {totalUsers}
                <span className="text-sm text-muted-foreground">/{userTrend * growth}</span>
              </h4>
              <p className="text-xs text-muted-foreground">
                <span
                  className={`${userTrend === 1
                      ? "text-green-500"
                      : userTrend === -1
                        ? "text-red-500"
                        : "text-primary/80"
                    } text-base`}
                >
                  {userTrend === 1 ? (
                    <TrendingUp className="inline-block mr-2 size-4" />
                  ) : userTrend === -1 ? (
                    <TrendingDown className="inline-block mr-2 size-4" />
                  ) : (
                    <CircleDashed className="inline-block mr-2 size-4" />
                  )}
                  {userGrowth?.toFixed(2)}%
                </span>{" "}
                from last month
              </p>
            </StatsCard>

            {/* Active Sessions Card */}
            <StatsCard
              title="Active Sessions"
              Icon={<TbUsersGroup className="inline-block mr-2 size-4" />}
            >
              <h4 className="text-3xl font-bold text-primary">
                {activeSessions}
              </h4>
              <p className="text-xs text-muted-foreground">
                Currently active sessions
              </p>
            </StatsCard>
            {/* Total Visitors Card */}
            <StatsCard
              title="Total Visitors"
              Icon={<Eye  className="inline-block mr-2 size-4" />}
            >
              <p className="text-3xl mt-auto">
                <img
                  height={20}
                  width={80}
                  src="https://visitor-badge.laobi.icu/badge?page_id=nith_portal.visitor-badge"
                  alt="Visitor counter"
                  className="inline-block font-inherit h-4"
                  loading="lazy"
                />
              </p>
              <p className="text-xs text-muted-foreground">
                Total visitors to the portal
              </p>
            </StatsCard>

            {/* Users by Gender Card */}
            <StatsCard
              title="Users by Gender"
              Icon={<FaGenderless className="inline-block mr-2 size-4" />}
            >
              <ul className="text-sm text-muted-foreground">
                {usersByGender.map(({ gender, count }) => (
                  <li key={gender}>
                    {gender}: <span className="font-bold">{count}</span>
                  </li>
                ))}
              </ul>
            </StatsCard>

            {/* Users by Role Card */}
            <StatsCard
              title="Users by Role"
              Icon={<CircleDashed className="inline-block mr-2 size-4" />}
            >
              <ul className="text-sm text-muted-foreground">
                {usersByRole.map(({ role, count }) => (
                  <li key={role}>
                    {role}: <span className="font-bold">{count}</span>
                  </li>
                ))}
              </ul>
            </StatsCard>

            {/* Users by Department Card */}
            <StatsCard
              title="Users by Department"
              Icon={<CircleDashed className="inline-block mr-2 size-4" />}
            >
              <ul className="text-sm text-muted-foreground">
                {usersByDepartment.map(({ department, count }) => (
                  <li key={department}>
                    {department}: <span className="font-bold">{count}</span>
                  </li>
                ))}
              </ul>
            </StatsCard>
            {/* Account Creation Trends */}
          </div>
        </div>

        {/* Messages Section */}
        <div className="@4xl:w-1/3 p-3">
          <Heading level={4}>Actions</Heading>
          <Separator className="mb-4" />
          <div className="w-full grid grid-cols-1 gap-3 divide-y divide-gray-200">
            <ActionBar
              title="Clear Cache"
              description={
                <p className="text-xs font-medium text-gray-600">
                  Flush the cache to clear all cached data.
                </p>
              }
              btnProps={{
                variant: "link",
                size: "sm",
                children: "Flush Cache",
                effect: "underline",
              }}
              action={flushCache}
            />
          </div>
          <Separator className="mt-2 mb-4" />

          <Heading level={4}>Messages</Heading>
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
