type LayoutProps = Readonly<{
  children: React.ReactNode;
}>;
import { ResponsiveAppLogo } from "@/components/logo";

export const dynamic = "force-dynamic";

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10 @container space-y-4">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <ResponsiveAppLogo className="flex items-center gap-2 self-center font-medium !h-10" />
        {children}
      </div>
    </div>
  );
}
