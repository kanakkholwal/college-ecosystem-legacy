import { cn } from "@/lib/utils";

export function ResponsiveContainer({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "w-full max-w-7xl grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-2 @2xl:grid-cols-3 @3xl:grid-cols-4 @5xl:grid-cols-4 @7xl:grid-cols-5 justify-start gap-4",
        className
      )}
      {...props}
    />
  );
}
