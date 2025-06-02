import EmptyArea from "@/components/common/empty-area";
import { Tabs, TabsContent, VercelTabsList } from "@/components/ui/tabs";
import { getSession } from "~/lib/auth-server";
import {
  getClosedPolls,
  getOpenPolls,
  getPollsCreatedByLoggedInUser,
} from "~/lib/poll/actions";
import type { PollType } from "~/models/poll";
import CreatePoll from "./components/create-poll";
import PollComponent from "./components/poll-component";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Polls`,
  description: "Check the latest polls here.",
};

export default async function PollsPage() {
  const session = await getSession();

  const [openPolls, closedPolls, userPolls] = await Promise.all([
    getOpenPolls(),
    getClosedPolls(),
    getPollsCreatedByLoggedInUser(),
  ]);

  return (
    <Tabs defaultValue="opened-polls" className="w-full grid gap-4">
      <VercelTabsList
        tabs={[
          { label: "Open Polls", id: "opened-polls" },
          { label: "Closed Polls", id: "closed-polls" },
          { label: "Your Polls", id: "your-polls" },
        ]}
      />

      <div className="rounded-lg p-4 @container/polls max-w-6xl mx-auto w-full">
        <TabsContent value="opened-polls">
          <div>
            <h3 className="text-xl font-medium">Open Polls</h3>
          </div>
          <div className="grid grid-cols-1 @2xl/polls:grid-cols-2 gap-3">
            {openPolls.map((poll: PollType) => (
              <PollComponent poll={poll} key={poll._id} />
            ))}
          </div>
          {openPolls.length === 0 && (
            <EmptyArea
              title="No open polls"
              description="There are no open polls at the moment."
            />
          )}
        </TabsContent>
        <TabsContent value="closed-polls">
          <div className="w-full flex justify-between items-center whitespace-nowrap gap-2">
            <h3 className="text-xl font-medium">Closed Polls</h3>
          </div>
          <div className="grid grid-cols-1 @2xl/polls:grid-cols-2 gap-3">
            {closedPolls.map((poll: PollType) => (
              <PollComponent poll={poll} key={poll._id} />
            ))}
          </div>
          {closedPolls.length === 0 && (
            <EmptyArea
              title="No closed polls"
              description="There are no closed polls at the moment."
            />
          )}
        </TabsContent>
        <TabsContent value="your-polls">
          <div className="w-full flex justify-between items-center whitespace-nowrap gap-2">
            <h3 className="text-xl font-medium">Polls created by you</h3>
            <CreatePoll />
          </div>
          <div className="grid grid-cols-1 @2xl/polls:grid-cols-2 gap-3">
            {userPolls.map((poll: PollType) => (
              <PollComponent poll={poll} key={poll._id} user={session?.user} />
            ))}
          </div>
          {userPolls.length === 0 && (
            <EmptyArea
              title="No polls created by you"
              description="You have not created any polls yet."
            />
          )}
        </TabsContent>
      </div>
    </Tabs>
  );
}
