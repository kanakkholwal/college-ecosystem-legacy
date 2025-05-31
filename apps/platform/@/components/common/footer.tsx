import { SocialBar, SupportBar } from "@/components/common/navbar";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "./theme-switcher";

export default function Footer() {
  return (
    <footer
      className={cn(
        "z-40 w-full transition-all pt-5 pb-8",
        "bg-card border-b",
      )}
    >
      <div className="flex justify-around flex-wrap gap-4 w-full max-w-(--max-app-width) mx-auto">
        <SocialBar />
        <SupportBar />
        <ThemeSwitcher />
      </div>
    </footer>
  );
}
