import Unauthorized from "@/screens/unauthorized";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getSession } from "src/lib/auth";
import { sessionType } from "src/types/session";

export const metadata: Metadata = {
  title: "SignIn | NITH - College Platform",
  description: "SignIn | NITH - College Platform",
};

export const dynamic = "force-dynamic";

export default async function Page() {
  const session = (await getSession()) as sessionType | null;
  const authorized = !!session?.user;

  if (authorized) return redirect("/");

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-6 md:p-12 lg:p-24 @container space-y-4">
      <Unauthorized />
    </div>
  );
}
