import EmptyArea from "@/components/common/empty-area";
import { Tabs, TabsContent, VercelTabsList } from "@/components/ui/tabs";
import {
  getClosedPolls,
  getOpenPolls,
  getPollsCreatedByLoggedInUser,
} from "~/lib/poll/actions";
import type { PollType } from "~/models/poll";
import CreatePoll from "./components/create-poll";
import PollComponent from "./components/poll-component";

import { Badge } from "@/components/ui/badge";
import { AuthButtonLink } from "@/components/utils/link";
import { LogIn } from "lucide-react";
import type { Metadata } from "next";
import { CgPoll } from "react-icons/cg";
import { getSession } from "~/lib/auth-server";

export const metadata: Metadata = {
  title: `Polls`,
  description: "Check the latest polls here.",
};

const tabs = [
  { label: "Open Polls", id: "opened-polls" },
  { label: "Closed Polls", id: "closed-polls" },
  { label: "Your Polls", id: "your-polls" },
];

export default async function PollsPage(props: {
  searchParams: Promise<{
    tab?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const activeTab = searchParams.tab || "opened-polls"; // Default to 'opened-polls' if no tab is provided

  const session = await getSession();
  // Check if the user is logged in then only getPollsCreatedByLoggedInUser
  const polls = await Promise.all([
    getOpenPolls(),
    getClosedPolls(),
    session?.user ? getPollsCreatedByLoggedInUser() : Promise.resolve([]),
  ]);

  return (
    <Tabs defaultValue={activeTab} className="w-full grid gap-4">
      <VercelTabsList tabs={tabs} onTabChangeQuery="tab" />

      <div className="rounded-lg p-4 @container/polls max-w-6xl mx-auto w-full">
        {tabs.map((tab, idx) => {
          if (tab.id === "your-polls" && !session?.user) {
            return (
              <TabsContent value={tab.id} key={tab.id}>
                <EmptyArea
                  title="Your Polls"
                  description="You need to be logged in to create or view your polls."
                  actionProps={{
                    asChild: true,
                    variant: "raw",
                    children:
                      <AuthButtonLink
                        authorized={!!session?.user}
                        variant="rainbow"
                        size="sm"
                        href="/polls?tab=opened-polls"
                      >
                        Login
                        <LogIn/>
                      </AuthButtonLink>
                  }}
                />
              </TabsContent>)
          }
          return (
            <TabsContent value={tab.id} key={tab.id}>
              <div className="md:sticky md:top-4 z-50 h-10 mb-5 w-full max-w-3xl mx-1.5 md:mx-auto flex justify-between items-center gap-2 bg-card px-2 lg:px-4 py-1 lg:py-2 rounded-lg border">
                <h3 className="text-sm font-medium">
                  <CgPoll className="inline-block align-middle mr-2 size-4" />
                  {tab.label}
                  <Badge size="sm" className="ml-2">
                    {polls[idx].length}
                  </Badge>
                </h3>
                {tab.id === "your-polls" && <CreatePoll />}
              </div>
              
              {polls[idx].length === 0 ? (
                <EmptyArea
                  title={`No ${tab.label.toLowerCase()}`}
                  description={`There are no ${tab.label.toLowerCase()} at the moment.`}
                />
              ) : (
                <div className="grid grid-cols-1 @2xl/polls:grid-cols-2 gap-3">
                  {polls[idx].map((poll: PollType) => (
                    <PollComponent poll={poll} key={poll._id} user={session?.user} />
                  ))}
                </div>
              )}
            </TabsContent>
          );
        })}
      </div>
    </Tabs>
  );
}
