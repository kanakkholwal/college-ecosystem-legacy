import ConditionalRender from "@/components/utils/conditional-render";
import { getSession } from "~/lib/auth-server";
import { changeCase } from "~/utils/string";
import AdminDashboard from "./context/admin.dashboard";
import CRDashboard from "./context/cr.dashboard";
import FacultyDashboard from "./context/faculty.dashboard";

interface Props {
  params: Promise<{
    moderator: string;
  }>;
}


export default async function ModeratorDashboard(props: Props) {
  const params = await props.params;
  const session = await getSession()
  


  return (
    <div className="space-y-6 my-5">
      <div>
        <h2 className="text-3xl font-semibold mb-2">
          Hi, {session?.user?.name}
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Welcome to the dashboard.
        </p>
      </div>

      <ConditionalRender
        condition={
          params.moderator === "admin" || params.moderator === "moderator"
        }
      >
        <AdminDashboard />
      </ConditionalRender>
      <ConditionalRender condition={params.moderator === "cr"}>
        <CRDashboard />
      </ConditionalRender>
      <ConditionalRender condition={params.moderator === "faculty"}>
        <FacultyDashboard />
      </ConditionalRender>
    </div>
  );
}
