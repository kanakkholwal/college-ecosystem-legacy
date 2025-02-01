import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export function SkeletonCard() {
    return (
        <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
    )
}

export function SkeletonCardArea({ className, count = 6, key = "SkeletonCardArea" }: { className?: string, count?: number, key?: string }) {
    return (
        <div className={cn("grid w-full @5xl:max-w-6xl grid-cols-1 @md:grid-cols-2 @4xl:grid-cols-4 text-left justify-start gap-4", className)}>
            {[...Array(count)].map((_, i) => (
                <SkeletonCard key={key + i.toString()} />
            ))}
        </div>

    )
}

