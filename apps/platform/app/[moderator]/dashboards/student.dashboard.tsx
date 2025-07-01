import { NumberTicker } from "@/components/animation/number-ticker";
import { StatsCard } from "@/components/application/stats-card";
import { ResponsiveContainer } from "@/components/common/container";
import { NoteSeparator } from "@/components/common/note-separator";
import { RouterCard } from "@/components/common/router-card";
import { Badge } from "@/components/ui/badge";
import { quick_links } from "@/constants/links";
import { getStudentDashboardData } from "~/actions/dashboard.student";

export default async function StudentDashboard({role}: { role: string })  {
  const dashboardData = await getStudentDashboardData();
  console.log("Student Dashboard Data:", dashboardData);

  return (
    <div className="space-y-6 my-5">
      <NoteSeparator
        label="Academics and Hostel Information"
        className="p-0"
      />
      <ResponsiveContainer className="w-full @5xl:grid-cols-3 pr-1.5 @4xl:pr-0">
        <StatsCard
          title="Class Rank"
        >

          <NumberTicker
            value={dashboardData?.result?.rank?.class || 0}
            className="text-3xl font-bold text-primary"
          />
          <p className="text-xs text-muted-foreground">
            Your current academic result rank in the in same branch and year.
          </p>
        </StatsCard>
        <StatsCard
          title="Hostel Assigned"
        >
          <h5 className="text-3xl font-bold text-primary">
            {dashboardData.hosteler ? dashboardData.hosteler.hostelName : "Not Assigned"}
          </h5>
          <p className="text-xs text-muted-foreground">
            {dashboardData.hosteler ? "Room No. : " + dashboardData.hosteler.roomNumber :
              "No room assigned yet"}
            {dashboardData.hosteler?.banned && (
              <Badge size="sm" variant="destructive_light" className="ml-2">
                {dashboardData.hosteler.banned ? "Banned" : "Active"}
              </Badge>
            )}
          </p>
          {!dashboardData.hosteler && (<p className="text-xs text-muted-foreground">
            Ask your mmca or admin to assign you a hostel.
          </p>)}
        </StatsCard>
        {dashboardData.hosteler && (<StatsCard
          title="Outpass Issued"
        >

          <NumberTicker

            value={dashboardData.outpassCount}
            className="text-3xl font-bold text-primary"
          />
          <p className="text-xs text-muted-foreground">
            No. of outpass(s) issued from current hostel
          </p>
        </StatsCard>)}

      </ResponsiveContainer>
      <NoteSeparator
        label="Platform Activities"
        className="p-0"
      />
      <ResponsiveContainer className="w-full @5xl:grid-cols-3 pr-1.5 @4xl:pr-0">
        {/* <StatsCard
          title="Total Resources Posted"
        >
          <NumberTicker
            value={dashboardData.platformActivities?.resourcesCount || 0}
            className="text-3xl font-bold text-primary"
          />
          <p className="text-xs text-muted-foreground">
            Total resources posts you have created.
          </p>
        </StatsCard> */}
        <StatsCard
          title="Total Community Posts"
        >
          <NumberTicker
            value={dashboardData.platformActivities?.communityPostsCount || 0}
            className="text-3xl font-bold text-primary"
          />
          <p className="text-xs text-muted-foreground">
            Total community posts you have created.
          </p>
        </StatsCard>
        <StatsCard
          title="Total Community Comments"
        >
          <NumberTicker
            value={dashboardData.platformActivities?.communityCommentsCount || 0}
            className="text-3xl font-bold text-primary"
          />
          <p className="text-xs text-muted-foreground">
            Total community comments you have created.
          </p>
        </StatsCard>
        <StatsCard
          title="Total Polls Created"
        >
          <NumberTicker
            value={dashboardData.platformActivities?.pollsCount || 0}
            className="text-3xl font-bold text-primary"
          />
          <p className="text-xs text-muted-foreground">
            Total polls you have participated in.
          </p>
        </StatsCard>
        <StatsCard
          title="Total Polls Created"
        >
          <NumberTicker
            value={dashboardData.platformActivities?.announcementsCount || 0}
            className="text-3xl font-bold text-primary"
          />
          <p className="text-xs text-muted-foreground">
            Total announcements you have created.
          </p>
        </StatsCard>
      </ResponsiveContainer>
      <NoteSeparator
        label="Platform Quick Links"
        className="p-0"
      />

      <ResponsiveContainer
        id="quick_links"
      >
        {quick_links.map((link, i) => (
          <RouterCard
            key={link.href}
            {...link}
            style={{
              animationDelay: `${i * 500}ms`,
            }}
          />
        ))}
      </ResponsiveContainer>
    </div>
  );
}
