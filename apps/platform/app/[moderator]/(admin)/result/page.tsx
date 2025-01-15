import { ActionBar } from "@/components/application/action-bar";
import { StatsCard } from "@/components/application/stats-card";
import { NotepadText } from "lucide-react";
import serverApis from "~/lib/server-apis";
import { getBasicInfo } from "./actions";

export default async function AdminResultPage() {
  const { counts, asOf } = await getBasicInfo();

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

        <StatsCard
          title="Total Results"
          Icon={<NotepadText className="h-4 w-4 text-muted-foreground" />}>
          <h4 className="text-3xl font-bold text-primary">
            {counts.results}
          </h4>
          <p className="text-xs text-muted-foreground">{`As of ${asOf}`}</p>
        </StatsCard>

        <StatsCard
          title="Assign Rank"
          Icon={<NotepadText className="h-4 w-4 text-muted-foreground" />}>
          <ActionBar
            title="Assign Rank"
            btnProps={{
              variant: "default_light",
              size: "sm",
              children: "Assign Rank"
            }}
            action={async ()=> await serverApis.results.assignRank()} />
        </StatsCard>

        <StatsCard
          title="Fix Branch Change"
          Icon={<NotepadText className="h-4 w-4 text-muted-foreground" />}>
          <ActionBar
            title="Fix Branch Change"
            btnProps={{
              variant: "default_light",
              size: "sm",
              children: "Fix Branch Change"
            }}
            action={async ()=> await serverApis.results.assignBranchChange()} />
        </StatsCard>
      </div>
    </>
  );
}
