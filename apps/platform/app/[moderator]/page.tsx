import { getSession } from "~/lib/auth-server";
import { DashboardTemplate } from "./context/dashboards";
import { Separator } from "@/components/ui/separator";
import { Heading, Paragraph } from "@/components/ui/typography";

interface Props {
  params: Promise<{
    moderator: string;
  }>;
}

export default async function ModeratorDashboard(props: Props) {
  const params = await props.params;
  const session = await getSession();

  return (
    <div className="space-y-6 my-5">
      <div className="w-full">
        <div className="@2xl:w-1/2">
          <Heading level={3} className="font-bold text-gray-800">
            Hi, {session?.user?.name}
          </Heading>
          <Paragraph className="capitalize !mt-0">
            Welcome to the {params.moderator} dashboard.
          </Paragraph>
        </div>
      </div>
      <Separator />
      <DashboardTemplate user_role={params.moderator} />
    </div>
  );
}
