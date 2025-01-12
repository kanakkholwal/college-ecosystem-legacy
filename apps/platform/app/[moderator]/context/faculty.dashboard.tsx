import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RocketIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { getSession } from "~/lib/auth-server";

export default async function FacultyDashboard() {
  const session = await getSession();

  return (
    <div className="w-full mx-auto space-y-5">
      <section id="welcome-header">
        <h2 className="text-base md:text-lg font-semibold whitespace-nowrap">
          Hi, {session?.user?.name}
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Welcome to the dashboard.
        </p>
      </section>
      <section id="main-section">
        <Alert className="mt-4">
          <RocketIcon className="h-4 w-4" />
          <AlertTitle>
            Suggest a feature for the platform here.(what do you want to see
            here?)
          </AlertTitle>
          <AlertDescription>
            <p>
              We are changing the way you interact with the platform and adding
              new features.
            </p>
            <Link
              href="https://forms.gle/v8Angn9VCbt9oVko7"
              target="_blank"
              rel="noopener noreferrer"
              className="underline mx-1"
            >
              Suggest a feature here
            </Link>{" "}
          </AlertDescription>
        </Alert>
      </section>
    </div>
  );
}
