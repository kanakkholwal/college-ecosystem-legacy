import { getSession } from "~/lib/auth-server";

export default async function GuardDashboard() {
  const session = await getSession();

  return (
    <div className="w-full mx-auto space-y-5">



    </div>
  );
}
