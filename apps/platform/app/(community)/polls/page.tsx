import EmptyArea from "@/components/common/empty-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  title: `Polls | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
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
    <Tabs defaultValue="opened" className="w-full">
      <TabsList className="max-w-5xl mx-auto w-full">
        <TabsTrigger value="opened" className="text-md w-full">
          Open Polls
        </TabsTrigger>
        <TabsTrigger value="closed" className="text-md w-full">
          Closed Polls
        </TabsTrigger>
        <TabsTrigger value="by-you" className="text-md w-full">
          By You
        </TabsTrigger>
      </TabsList>
      <div className="mt-5 rounded-lg p-4 @container/polls">
        <TabsContent value="opened">
          <div className="w-full flex justify-between items-center whitespace-nowrap gap-2">
            <h3 className="text-xl font-semibold">Open polls</h3>
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
        <TabsContent value="closed">
          <div className="w-full flex justify-between items-center whitespace-nowrap gap-2">
            <h3 className="text-xl font-semibold">Closed polls</h3>
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
        <TabsContent value="by-you">
          <div className="w-full flex justify-between items-center whitespace-nowrap gap-2">
            <h3 className="text-xl font-semibold">Polls created by you</h3>
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
