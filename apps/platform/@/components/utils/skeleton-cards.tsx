import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ResponsiveContainer } from "@/components/common/container";

export function SkeletonCard({
  className,
  skeletonClassName,
}: {
  className?: string;
  skeletonClassName?: string;
}) {
  return (
    <div className={cn("flex flex-col space-y-3", className)}>
      <Skeleton
        className={cn("h-[125px] w-[250px] rounded-xl", skeletonClassName)}
      />
      <div className="space-y-2">
        <Skeleton className={cn("h-4 w-[250px]", skeletonClassName)} />
        <Skeleton className={cn("h-4 w-[200px]", skeletonClassName)} />
      </div>
    </div>
  );
}

export function SkeletonCardArea({
  className,
  count = 6,
  key = "SkeletonCardArea",
  skeletonClassName,
  cardClassName,
}: {
  className?: string;
  count?: number;
  key?: string;
  skeletonClassName?: string;
  cardClassName?: string;
}) {
  return (
    <ResponsiveContainer className={cn("justify-center", className)}>
      {[...Array(count)].map((_, i) => (
        <SkeletonCard
          key={key + i.toString()}
          className={cardClassName}
          skeletonClassName={skeletonClassName}
        />
      ))}
    </ResponsiveContainer>
  );
}
