type LayoutProps = Readonly<{
  children: React.ReactNode;
}>;
import { MagicCard } from "@/components/animation/magic-card";
import { ApplicationInfo } from "@/components/logo";
import Link from "next/link";


export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10 @container space-y-4">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-medium !h-10">
          <ApplicationInfo className="flex items-center gap-2 self-center font-medium !h-10" />
        </Link>
        <div className="flex flex-col gap-6">
          <MagicCard className="rounded-lg shadow" layerClassName="bg-card">
            {children}
          </MagicCard>
        </div>
      </div>
    </div>
  );
}
