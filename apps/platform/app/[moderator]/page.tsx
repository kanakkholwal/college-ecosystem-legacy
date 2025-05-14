import { Separator } from "@/components/ui/separator";
import { Heading, Paragraph } from "@/components/ui/typography";
import { getSession } from "~/lib/auth-server";
import { changeCase } from "~/utils/string";
import { DashboardTemplate } from "./dashboards";

interface Props {
  params: Promise<{
    moderator: string;
  }>;
}

export default async function ModeratorDashboard(props: Props) {
  const params = await props.params;
  const session = await getSession();

  return (
    <div className="w-full space-y-6 my-5">
      <section id="welcome-header" className="w-full">
        <div className="@2xl:w-1/2">
          <Heading level={3} className="text-base md:text-lg font-bold">
            Hi, {session?.user?.name}
          </Heading>
          <Paragraph className="!mt-0 text-muted-foreground">
            Welcome to the{" "}
            {changeCase(params.moderator.replaceAll("_", " "), "title")}{" "}
            dashboard.
          </Paragraph>
        </div>
      </section>
      <Separator />
      <DashboardTemplate user_role={params.moderator} />
    </div>
  );
}
