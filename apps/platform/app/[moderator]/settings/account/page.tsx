import { Separator } from "@/components/ui/separator";
import { AccountForm } from "./account-form";
import type { Session } from "~/lib/auth";
import { getSession } from "~/lib/auth-server";

export default async function SettingsAccountPage() {
  const session = (await getSession()) as Session;
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-sm text-muted-foreground">
          Update your account settings.
        </p>
      </div>
      <Separator />
      <AccountForm currentUser={session.user} />
    </div>
  );
}
