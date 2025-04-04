import { notFound } from "next/navigation";
import { getUser } from "~/actions/dashboard.admin";
import { UserDisplay, UserSessions, UserUpdate } from "./components";

import { TabsTransitionPanel } from "@/components/ui/tabs-transition";
import { getHostels } from "~/actions/hostel";

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
      <TabsTransitionPanel
        items={[
          {
            title: "User Details",
            content: <UserDisplay currentUser={user} />,
            id: "user_details",
          },
          {
            title: "User Sessions",
            content: <UserSessions currentUser={user} />,
            id: "user_sessions",
          },
          {
            title: "Update User",
            content: <UserUpdate currentUser={user} hostels={data} />,
            id: "user_update",
          },
        ]}
      />
    </div>
  );
}
