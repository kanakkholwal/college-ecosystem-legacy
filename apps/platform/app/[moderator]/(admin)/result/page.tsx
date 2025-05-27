import { NumberTicker } from "@/components/animation/number-ticker";
import { ActionBar } from "@/components/application/action-bar";
import { StatsCard } from "@/components/application/stats-card";
import { NotepadText } from "lucide-react";
import { assignBranchChange, assignRank, getBasicInfo } from "./actions";
import { GetResultDiv } from "./client";

export default async function AdminResultPage() {
  const { counts, asOf } = await getBasicInfo();

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <StatsCard
          title="Total Results"
          Icon={<NotepadText className="h-4 w-4 text-muted-foreground" />}
        >
          <NumberTicker
            value={counts.results}
            className="text-3xl font-bold text-primary"
          />
          <p className="text-xs text-muted-foreground">As of {asOf}</p>
        </StatsCard>

        <StatsCard
          title="Assign Rank"
          Icon={<NotepadText className="h-4 w-4 text-muted-foreground" />}
        >
          <ActionBar
            description="This will assign ranks to all students based on their CGPI."
            btnProps={{
              variant: "default_light",
              size: "sm",
              children: "Assign Rank",
            }}
            action={assignRank}
          />
        </StatsCard>

        <StatsCard
          title="Fix Branch Change"
          Icon={<NotepadText className="h-4 w-4 text-muted-foreground" />}
        >
          <ActionBar
            description="This will fix the branch change for all students who have changed their branch."
            btnProps={{
              variant: "default_light",
              size: "sm",
              children: "Fix Branch Change",
            }}
            action={assignBranchChange}
          />
        </StatsCard>

        <StatsCard
          title="Get Result"
          Icon={<NotepadText className="h-4 w-4 text-muted-foreground" />}
        >
          <GetResultDiv />
        </StatsCard>
      </div>
    </>
  );
}
