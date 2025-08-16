import { notFound } from "next/navigation";
import { getUser } from "~/actions/dashboard.admin";
import { UserDisplay, UserSessions, UserUpdate } from "./components";

import { Tabs, TabsContent, VercelTabsList } from "@/components/ui/tabs";
import { getHostels } from "~/actions/hostel.core";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UpdateUserPage({ params }: PageProps) {
  const user = await getUser((await params).id);
  if (!user) {
    return notFound();
  }

  const { data } = await getHostels();

  return (
    <div className="space-y-6 my-5">
      <Tabs
        defaultValue="user_details"
        className="w-full max-w-(--max-app-width) mx-auto"
      >
        <VercelTabsList
          tabs={[
            { label: "User Details", id: "user_details" },
            { label: "User Sessions", id: "user_sessions" },
            { label: "Update User", id: "user_update" },
          ]}
          onTabChangeQuery="tab"
        />
        <div className="w-full max-w-(--max-app-width) mx-auto bg-card p-4 rounded-lg shadow mt-4">
          <TabsContent value="user_details">
            <UserDisplay currentUser={user} />
          </TabsContent>
          <TabsContent value="user_sessions">
            <UserSessions currentUser={user} />
          </TabsContent>
          <TabsContent value="user_update">
            <UserUpdate currentUser={user} hostels={data} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
