"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { type themeType } from "@/constants/theme";
import { cn } from "@/lib/utils";
import { Monitor, Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";


const themes = [
  {
    key: "system",
    Icon: Monitor,
    label: "System",
  },
  {
    key: "light",
    Icon: Sun,
    label: "Light",
  },
  {
    key: "dark",
    Icon: Moon,
    label: "Dark",
  },
] as const;

export type ThemeSwitcherProps = {
  onChange?: (theme: themeType) => void;

  className?: string;
};

export const ThemeSwitcher = ({ onChange, className }: ThemeSwitcherProps) => {
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  const CurrentTheme = themes.find((t) => t.key === theme);

  return (
    <div
      className={cn(
        "relative ",
        className
      )}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon_sm" rounded="full">
            {CurrentTheme ?
              <CurrentTheme.Icon className="size-4 absolute inset-0 m-auto" />
              : <Monitor className="size-4" />}
            <span className="sr-only">Open theme switcher</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" alignOffset={-8} className="max-w-24 space-y-1">
          {themes.map(({ key, Icon: Icon, label }) => {
            const isActive = theme === key;
            return (
              <Button
                variant="ghost"
                size="sm"
                width="full"
                key={key}
                onClick={() => {
                  setTheme(key as themeType);
                  onChange?.(key as themeType);
                }}
                className={cn(
                  "justify-start relative text-xs",
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTheme"
                    className="absolute inset-0 rounded-full bg-primary/10 dark:bg-primary/20"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
                <Icon className="size-4 relative" />
                <span className="relative">
                  {label}
                </span>
              </Button>
            );
          })}

        </DropdownMenuContent>
      </DropdownMenu>
      {/* {themes.map(({ key, Icon: Icon, label }) => {
        const isActive = theme === key;

        return (
          <button
            type="button"
            key={key}
            className="relative size-6 rounded-full"
            onClick={() => setTheme(key as themeType)}
            aria-label={label}
          >
            {isActive && (
              <motion.div
                layoutId="activeTheme"
                className="absolute inset-0 rounded-full bg-secondary"
                transition={{ type: "spring", duration: 0.5 }}
              />
            )}
            <Icon
              className={cn(
                "relative m-auto size-4",
                isActive ? "text-white" : "text-muted-foreground"
              )}
            />
          </button>
        );
      })} */}
    </div>
  );
};
