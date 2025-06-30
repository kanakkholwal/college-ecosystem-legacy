import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type StatsCardProps = {
  title: string;
  children: React.ReactNode;
  Icon?: React.ReactNode;
  className?: string;
};

export function StatsCard({ title, children, Icon,className }: StatsCardProps) {
  return (
    <Card className={cn("hover:border-primary hover-shadow-primary",className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 @2xl:p-4">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon}
      </CardHeader>
      <CardContent className="space-y-2 @2xl:p-4 @2xl:pt-0">
        {children}
      </CardContent>
    </Card>
  );
}
