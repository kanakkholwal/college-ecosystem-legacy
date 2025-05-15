import EmptyArea from "@/components/common/empty-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ConditionalRender from "@/components/utils/conditional-render";
import ErrorBanner from "@/components/utils/error";
import { ErrorBoundaryWithSuspense } from "@/components/utils/error-boundary";
import { SkeletonCardArea } from "@/components/utils/skeleton-cards";
import { RocketIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import AdminDashboard from "./admin.dashboard";
import ChiefWardenDashboard from "./chief_warden.dashboard";
import CRDashboard from "./cr.dashboard";
import GuardDashboard from "./guard.dashboard";
import StudentDashboard from "./student.dashboard";
import WardenDashboard from "./warden.dashboard";
// import type { JSX } from "react";

// type DashboardTemplateType = Promise<JSX.Element> | JSX.Element;

const dashboard_templates = new Map([
  ["admin", AdminDashboard],
  ["cr", CRDashboard],
  ["guard", GuardDashboard],
  ["student", StudentDashboard],
  ["warden", WardenDashboard],
  ["assistant_warden", WardenDashboard],
  ["chief_warden", ChiefWardenDashboard],
]);

export function DashboardTemplate({ user_role }: { user_role: string }) {
  if (dashboard_templates.has(user_role)) {
    const DashboardComponent = dashboard_templates.get(user_role);
    if (DashboardComponent) {
      return (
        <>
          <ConditionalRender condition={user_role === "student"}>
            <section id="main-section">
              <Alert className="mt-4">
                <RocketIcon className="h-4 w-4" />
                <AlertTitle>
                  Suggest a feature for the platform here.(what do you want to
                  see here?)
                </AlertTitle>
                <AlertDescription>
                  <p>
                    We are changing the way you interact with the platform and
                    adding new features.
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
          </ConditionalRender>
          <ErrorBoundaryWithSuspense
            fallback={<ErrorBanner />}
            loadingFallback={
              <SkeletonCardArea
                className="mx-auto"
                skeletonClassName="bg-gray-200"
              />
            }
          >
            <DashboardComponent />
          </ErrorBoundaryWithSuspense>
        </>
      );
    }
  }
  return (
    <EmptyArea
      title="No Dashboard"
      description="Looks like you are not assigned to any dashboard yet."
    />
  );
}
