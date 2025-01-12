import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NotepadText } from "lucide-react";

import { getBasicInfo } from "./actions";

import { AssignRankCard } from "./client";

export default async function AdminResultPage() {
  const { counts, asOf } = await getBasicInfo();

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Card variant="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Results</CardTitle>
            <NotepadText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <h4 className="text-3xl font-bold text-primary">
              {counts.results}
            </h4>
            <p className="text-xs text-muted-foreground">{`As of ${asOf}`}</p>
          </CardContent>
        </Card>
        <AssignRankCard />
      </div>
    </>
  );
}
