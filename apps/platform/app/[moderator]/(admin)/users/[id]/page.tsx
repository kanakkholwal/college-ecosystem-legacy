import { notFound } from "next/navigation";
import { getUser } from "~/actions/dashboard.admin";
import { UserDisplay, UserSessions, UserUpdate } from "./components";

import { TabsTransitionPanel } from "./client";

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

  return (
    <div className="space-y-6 my-5">
      <TabsTransitionPanel
        items={[
          {
            title: "User Details",
            subtitle: "View user sessions",
            content: <UserDisplay currentUser={user} />,
            id: "1",
          },
          {
            title: "User Sessions",
            subtitle: "Update user information",
            content: <UserSessions currentUser={user} />,
            id: "2",
          },
          {
            title: "Update User",
            subtitle: "Update user information",
            content: <UserUpdate currentUser={user} />,
            id: "3",
          },
        ]}
      />
    </div>
  );
}
