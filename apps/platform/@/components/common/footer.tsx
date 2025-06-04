import { SocialBar, SupportBar } from "@/components/common/navbar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { appConfig } from "~/project.config";
import GithubStars from "./github";
import { ThemeSwitcher } from "./theme-switcher";



export default async function Footer() {

  return (
    <footer
      className={cn(
        "z-40 w-full transition-all pt-5 pb-8 mt-auto",
        "bg-card border-b",
      )}
    >
      <div className="w-full max-w-(--max-app-width) mx-auto p-4 flex flex-wrap gap-3 justify-between items-start">
        <div>
          <h4 className="space-x-1 items-center align-middle">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={280}
              height={80}
              className="h-8 w-auto object-contain relative inline-block dark:hidden"
            />
            <Image
              src="/logo-dark.svg"
              alt="Logo"
              width={280}
              height={80}
              className="h-8 w-auto object-contain relative hidden dark:inline-block"
            />
          </h4>
          <p className="text-sm text-muted-foreground mt-2">
            {appConfig.description}
          </p>
        </div>
        <div className="inline-flex items-center gap-2">
          <ThemeSwitcher />
          <Separator orientation="vertical" />
          <SocialBar />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-start gap-4 w-full max-w-(--max-app-width) mx-auto p-3">
        <GithubStars/>
        <SupportBar />
      </div>
    </footer>
  );
}
