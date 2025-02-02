import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export function SkeletonCard({className,skeletonClassName}: {className?: string, skeletonClassName?: string}) {
    return (
        <div className={cn("flex flex-col space-y-3",className)}>
            <Skeleton className={cn("h-[125px] w-[250px] rounded-xl",skeletonClassName)}/>
            <div className="space-y-2">
                <Skeleton className={cn("h-4 w-[250px]",skeletonClassName)} />
                <Skeleton className={cn("h-4 w-[250px]",skeletonClassName)} />
            </div>
        </div>
    )
}

export function SkeletonCardArea({ className, count = 6, key = "SkeletonCardArea",skeletonClassName,cardClassName }: { className?: string, count?: number, key?: string,skeletonClassName?: string,cardClassName?: string }) {
    return (
        <div className={cn("grid w-full @5xl:max-w-6xl grid-cols-1 @md:grid-cols-2 @4xl:grid-cols-4 text-left justify-start gap-4", className)}>
            {[...Array(count)].map((_, i) => (
                <SkeletonCard key={key + i.toString()} className={cardClassName} skeletonClassName={skeletonClassName}/>
            ))}
        </div>

    )
}

