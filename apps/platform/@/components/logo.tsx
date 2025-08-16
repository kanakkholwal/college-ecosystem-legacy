import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { appConfig, orgConfig } from "~/project.config";

export function AppLogo({ className,showLogo= false }: { className?: string,showLogo?: boolean }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 justify-center items-center mx-auto ",
        className
      )}
    >
       {showLogo ? <Avatar className="h-8 w-8 rounded-lg">
        <AvatarImage
          src="/logo-square.webp"
          alt={appConfig.name}
        />
        <AvatarFallback className="flex items-center justify-center rounded-lg text-3xl font-bold text-center relative bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent hover:from-sky-500 hover:to-primary whitespace-nowrap">
          {orgConfig.shortName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      :(<h1 className="text-2xl md:text-7xl font-bold text-center relative bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent hover:from-sky-500 hover:to-primary whitespace-nowrap">
        {orgConfig.shortName}
      </h1>)}
      <h2 className="text-md md:text-xl font-semibold capitalize text-muted-foreground text-center">
        {appConfig.name}
      </h2>
    </div>
  );
}
export function ResponsiveAppLogo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-0 justify-center items-center mx-auto ",
        className
      )}
    >
      <h1 className="text-3xl font-bold text-center relative bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hover:from-secondary hover:to-primary whitespace-nowrap">
        {orgConfig.shortName}
      </h1>
      <h2 className="text-base font-semibold capitalize text-center">
        {appConfig.name}
      </h2>
    </div>
  );
}

export function ApplicationInfo({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "inline-flex gap-2",
        className
      )}
    >
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarImage
          src="/logo-square.webp"
          alt={appConfig.name}
        />
        <AvatarFallback className="flex items-center justify-center rounded-lg text-3xl font-bold text-center relative bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent hover:from-sky-500 hover:to-primary whitespace-nowrap">
          {orgConfig.shortName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">{appConfig.name}</span>
        <span className="truncate text-xs text-muted-foreground font-medium">{orgConfig.mailSuffix}</span>
      </div>
      {children}
    </div>
  );
}
export function ApplicationSquareLogo({
  className,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (

      <Avatar
      className={cn(
        "inline-flex gap-2 size-8 rounded-lg",
        className
      )}
      >
        <AvatarImage
          src="/logo-square.webp"
          alt={appConfig.name}
        />
        <AvatarFallback className="flex items-center justify-center rounded-lg text-3xl font-bold text-center relative bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent hover:from-sky-500 hover:to-primary whitespace-nowrap">
          {orgConfig.shortName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

  );
}