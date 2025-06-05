import { NumberTicker } from "@/components/animation/number-ticker";
import { ChartBar } from "@/components/application/charts";
import { StatsCard } from "@/components/application/stats-card";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/typography";
import { Briefcase, CircleDashed, Eye, Network, Transgender, TrendingDown, TrendingUp } from "lucide-react";
import { TbUsersGroup } from "react-icons/tb";
import {
  getActiveSessions,
  getUsersByDepartment,
  getUsersByGender,
  getUsersByRole,
  users_CountAndGrowth,
} from "~/actions/dashboard.admin";
import { ROLES_LIST } from "~/constants";
import { DEPARTMENTS_LIST, getDepartmentCode } from "~/constants/departments";
import { changeCase } from "~/utils/string";

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
      <div className="flex justify-between gap-2 w-full flex-col @4xl:flex-row divide-y @4xl:divide-x divide-border">
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
              <NumberTicker
                value={totalUsers}
                className="text-3xl font-bold text-primary"
              />

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
              Icon={<Eye className="inline-block mr-2 size-4" />}
            >
              <p className="text-3xl mt-auto">
                {/* eslint-disable @next/next/no-img-element */}
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
              Icon={<Transgender  className="inline-block mr-2 size-4" />}
            >


              <ChartBar
                data={usersByGender}
                orientation="vertical"
                config={{
                    count: {
                    label: "Gender",
                  },

                  male: {
                    label: "Male",
                    color: "var(--chart-1)",
                  },
                  not_specified: {
                    label: "Not Specified",
                    color: "var(--chart-2)",
                  },
                  female: {
                    label: "Female",
                    color: "var(--chart-3)",
                  },
                }}
                dataKey="count"
                nameKey="gender"
              />
              <p className="text-xs text-muted-foreground">
                Total Users by Gender
              </p>
            </StatsCard>

            {/* Users by Role Card */}
            <StatsCard
              title="Users by Role"
              Icon={<Briefcase  className="inline-block mr-2 size-4" />}
            >

              <ChartBar
                data={usersByRole}
                orientation="vertical"
                config={{
                  count: {
                    label: "Role",
                  },

                  ...ROLES_LIST.reduce<Record<string, { label: string; color: string }>>((acc, role, idx) => {
                    acc[role] = {
                      label: changeCase(role, "title"),
                      color: `var(--chart-${idx + 1})`,
                    };
                    return acc;
                  }, {}),
                }}
                dataKey="count"
                nameKey="role"
                
              />
              <p className="text-xs text-muted-foreground">
                Total Users per Role
              </p>
            </StatsCard>

            {/* Users by Department Card */}
            <StatsCard
              title="Users by Department"
              Icon={<Network  className="inline-block mr-2 size-4" />}
            >
              <ChartBar
                data={usersByDepartment.map((dept) => ({
                  department: getDepartmentCode(dept.department),
                  count: dept.count,
                }))}
                config={{
                  count: {
                    label: "Department",
                  },
                  staff: {
                    label: "Staff",
                    color: "var(--chart-1)",
                  },

                  ...DEPARTMENTS_LIST.reduce<Record<string, { label: string; color: string }>>((acc, dept, idx) => {
                    acc[dept.code] = {
                      label: changeCase(dept.name, "title"),
                      color: `var(--chart-${idx + 1})`,
                    };
                    return acc;
                  }, {}),
                }}
                dataKey="count"
                nameKey="department"
                
              />
              <p className="text-xs text-muted-foreground">
                Total Users per Department
              </p>
            </StatsCard>
            {/* Account Creation Trends */}
          </div>
        </div>

        {/* Messages Section */}
        <div className="@4xl:w-1/3 p-3">
          <Heading level={4}>Actions</Heading>
          <Separator className="mb-4 mt-2" />
        </div>
      </div>
    </div>
  );
}
