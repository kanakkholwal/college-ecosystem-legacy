import AdminDashboard from "./admin.dashboard";
import CRDashboard from "./cr.dashboard";
import GuardDashboard from "./guard.dashboard";
import { ErrorBoundaryWithSuspense } from "@/components/utils/error-boundary";
import ErrorBanner from "@/components/utils/error";
import { SkeletonCardArea } from "@/components/utils/skeleton-cards";
import EmptyArea from "@/components/common/empty-area";


const dashboard_templates = new Map([
    ["admin", AdminDashboard],
    ["cr", CRDashboard],
    ["guard", GuardDashboard],
]);

export function DashboardTemplate({ user_role }: { user_role: string; }) {
    if (dashboard_templates.has(user_role)) {
        const DashboardComponent = dashboard_templates.get(user_role);
        if (DashboardComponent) {
            return (
                <ErrorBoundaryWithSuspense fallback={<ErrorBanner />} loadingFallback={<SkeletonCardArea className="mx-auto" skeletonClassName="bg-gray-200" />}>
                    <DashboardComponent />
                </ErrorBoundaryWithSuspense>
            );
        }
    }
    return <EmptyArea
        title="No Dashboard"
        description="Looks like you are not assigned to any dashboard yet."
    />;
}
