import { getSession } from "~/lib/auth-server";
import OutPassHandler from "@/components/application/hostel/outpass-handler";

export default async function GuardDashboard() {
  const session = await getSession();

  return (
    <div className="w-full mx-auto space-y-5">

      <OutPassHandler/>

    </div>
  );
}
