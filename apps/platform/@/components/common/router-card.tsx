import { cn } from "@/lib/utils";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";

type RouterCardLink = {
  href: string;
  title: string;
  description: string;
  external?: boolean;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  disabled?: boolean;
  // preserveParams?: boolean;
};

interface RouterCardProps extends RouterCardLink {
  style?: React.CSSProperties;
}

function RouterCard({
  href,
  title,
  description,
  external = false,
  Icon,
  style,
  disabled,
  // preserveParams,
}: RouterCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "@max-lg:col-span-full bg-card block border p-4 rounded-lg shadow-md text-card-foreground transition-all",
        "group flex flex-col justify-between gap-2 animate-in popup backdrop-blur-2xl shadow-sm relative",
        "hover:-translate-1",
        disabled ? "pointer-events-none cursor-not-allowed" : ""
      )}
      target={external ? "_blank" : "_self"}
      rel={external ? "noopener noreferrer" : undefined}
      style={style}
    >
      <div className="flex w-full flex-row gap-2 items-center justify-center">
        <div className="flex justify-center items-center size-10 rounded-full bg-muted font-bold text-lg shrink-0">
          <Icon className="size-5 text-primary inline-block" />
        </div>
        <div className="flex-auto">
          <h5 className="not-prose mb-1 text-sm font-medium">{title}</h5>
          {disabled ? (
            <Badge
              size="sm"
              className="text-xs text-muted-foreground prose-no-margin"
            >
              Maintenance
            </Badge>
          ) : null}
        </div>
      </div>
      <p className="max-w-[30ch] text-xs text-muted-foreground prose-no-margin">
        {description}
      </p>
      <p className="text-xs whitespace-nowrap font-semibold text-primary/80 transition-all group-hover:text-primary group-hover:translate-x-1 motion-reduce:transform-none  [&_svg]:size-4 [&_svg]:ml-1 [&_svg]:inline-block">
        Go to {title}
        {external ? <ArrowUpRight /> : <ArrowRight />}
      </p>
          {/* Decorative elements */}
        <span className="from-primary/0 via-primary to-primary/0 absolute -bottom-px left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r opacity-60"/>
        <span className="absolute inset-0 bg-[radial-gradient(30%_5%_at_50%_100%,hsl(var(--primary)/0.15)_0%,transparent_100%)] opacity-60"/>
    </Link>
  );
}

RouterCard.displayName = "RouterCard";

export { RouterCard, type RouterCardLink, type RouterCardProps };
