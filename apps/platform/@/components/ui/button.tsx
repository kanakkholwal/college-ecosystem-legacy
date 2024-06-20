"use client";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap capitalize rounded-md text-sm font-semibold tracking-wide ring-offset-background transition-transform transition-duration-300 transition transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary dark:bg-primary text-white hover:bg-primary/90",
        default_light:
          "bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/10 dark:text-primary hover:dark:bg-primary/5 hover:dark:text-primary",
        success_light:
          "bg-green-500/10 text-green-500 hover:bg-green-500/20 dark:bg-green-500/20 dark:text-green-500 hover:dark:bg-green-500/10 hover:dark:text-green-500",
        warning_light:
          "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 dark:bg-yellow-500/20 dark:text-yellow-500 hover:dark:bg-yellow-500/10 hover:dark:text-yellow-500",
        destructive_light:
          "bg-red-500/10 text-red-500 hover:bg-red-500/20 dark:bg-red-500/5 dark:text-red-500 hover:dark:bg-red-500/10 hover:dark:text-red-500",
        destructive:
          "bg-red-100 hover:bg-red-200 text-red-600	dark:bg-red-700 dark:text-red-200 dark:hover:bg-red-800 dark:hover:text-red-200",
        outline:
          "border border-input bg-accent hover:bg-accent/80 hover:text-accent-foreground dark:bg-gray-800 dark:border-gray-700 dark:text-white",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/90",
        ghost:
          "bg-slate-100 hover:bg-slate-200 hover:text-accent-foreground dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white",
        success:
          "bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700",
        slate:
          "bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-950 dark:hover:text-slate-100",
        link: "text-primary underline-offset-4 hover:underline",
        dark: "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200",
        light:
          "bg-white shadow text-gray-600 hover:text-gray-700 border border-border",
        glass:
          "bg-white/90 dark:bg-white/5 backdrop-blur-xl border-slate-500/10 dark:border-border/70",
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
        default: "h-10 px-4 px-5 py-2.5 [&>svg]:w-5 [&>svg]:h-5",
        sm: "h-8 rounded-md px-3 py-2 text-xs [&>svg]:w-4 [&>svg]:h-4",
        lg: "px-5 py-3 text-base h-12 [&>svg]:w-6 [&>svg]:h-6",
        xl: "px-6 py-3.5 text-base [&>svg]:w-8 [&>svg]:h-8",
        icon: "h-10 w-10 p-3 [&>svg]:w-5 [&>svg]:h-5",
        icon_sm: "h-8 w-8 p-2 [&>svg]:w-4 [&>svg]:h-4",
        icon_lg: "h-12 w-12 p-3.5 [&>svg]:w-6 [&>svg]:h-6",
        icon_xl: "h-14 w-14 p-4 [&>svg]:w-8 [&>svg]:h-8",
      },
      width: {
        default: "w-auto",
        full: "w-full",
        xs: "w-full max-w-xs mx-auto",
        sm: "w-full max-w-sm mx-auto",
        md: "w-full max-w-md mx-auto",
        lg: "w-full max-w-lg mx-auto",
      },
      rounded: {
        default: "rounded-md",
        full: "rounded-full",
        none: "rounded-none",
      },
      transition: {
        none: "",
        damped:
          "transition-all hover:scale-105 active:duration-75 active:scale-95",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      transition: "none",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      rounded,
      transition,
      width,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          buttonVariants({
            variant,
            size,
            className,
            transition,
            rounded,
            width,
          })
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
