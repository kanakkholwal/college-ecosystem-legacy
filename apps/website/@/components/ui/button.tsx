"use client";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-lg transition-duration-300  ",
  {
    variants: {
      variant: {
        default: "bg-primary dark:bg-primary text-white  hover:bg-primary/90",
        default_light: "bg-primary/10 text-primary hover:bg-primary/20",
        success_light: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
        warning_light:
          "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
        destructive_light:
          "bg-red-500/10 text-red-500 hover:bg-red-500/20 dark:bg-red-500/20 dark:text-red-500 hover:dark:bg-red-500/10 hover:dark:text-red-500",
        destructive:
          "bg-red-100 hover:bg-red-200 text-red-600	dark:bg-red-700 dark:text-red-200 dark:hover:bg-red-800 dark:hover:text-red-200",
        outline:
          "border border-input bg-accent hover:bg-accent/80 hover:text-accent-foreground dark:bg-gray-800 dark:text-primary-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "bg-white hover:bg-white hover:text-accent-foreground dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white",
        slate:
          "bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-950 dark:hover:text-slate-100",
        dark: "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white/80 dark:hover:bg-white/70 dark:text-slate-200",
        link: "text-primary underline-offset-4 hover:underline",
        success:
          "bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700",
        gradient_blue:
          "text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br",
        gradient_green:
          "text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br",
        gradient_cyan:
          "text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br",
        gradient_teal:
          "text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br",
        gradient_lime:
          "text-white bg-gradient-to-r from-lime-400 via-lime-500 to-lime-600 hover:bg-gradient-to-br",
        gradient_red:
          "text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br",
        gradient_pink:
          "text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br",
        gradient_purple:
          "text-white bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 hover:bg-gradient-to-br",
      },
      size: {
        default: "h-10 px-4 px-5 py-2.5",
        sm: "h-8 rounded-md px-3 py-2 text-sm",
        xs: "px-3 py-2 text-xs h-4",
        lg: "px-5 py-3 text-base h-14",
        xl: "px-6 py-3.5 text-base",
        icon: "h-10 w-10 p-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
