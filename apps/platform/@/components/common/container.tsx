import { cn } from "@/lib/utils";

export function ResponsiveContainer({ className,...props }:React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("grid w-full @5xl:max-w-6xl grid-cols-1 @md:grid-cols-2 @4xl:grid-cols-4 justify-start gap-4",className)} {...props}/>
    );
}