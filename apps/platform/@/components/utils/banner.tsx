"use client";
import { BorderBeam } from "@/components/animation/border-beam";
import { Button } from "@/components/ui/button";
import useStorage from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import React from "react";
import { ButtonLink } from "./link";

interface BannerActionPropsBase {
  className?: string;
  title: string | React.ReactNode;
  description: string | React.ReactNode;
  redirectUrl?: string;
  isClosable?: boolean;
  onClose?: () => void;
  icon?: React.ReactNode | null;
  id?: string;
}

interface BannerActionWithBtnProps extends BannerActionPropsBase {
  btnProps:
    | React.ComponentProps<typeof Button>
    | React.ComponentProps<typeof ButtonLink>;
  actionComponent?: never;
}

interface BannerActionWithComponent extends BannerActionPropsBase {
  btnProps?: never;
  actionComponent: React.ReactNode;
}

type BannerPanelProps = BannerActionWithBtnProps | BannerActionWithComponent;

export function BannerPanel({
  className,
  description,
  title,
  btnProps,
  actionComponent,
  redirectUrl,
  isClosable = true,
  icon,
  id,
  onClose,
}: BannerPanelProps) {
  const [isBannerPanelClosed, setIsBannerPanelClosed] = useStorage(
    id ? `bannerPanelClosed-${id}` : "bannerPanelClosed",
    false,
    "sessionStorage"
  );

  return (
    <AnimatePresence>
      {!isBannerPanelClosed && (
        <motion.div
          initial={{ opacity: 0, y: -50, height: "auto" }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -50, height: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className={cn(
            "bg-muted px-4 py-3 md:py-2 relative shadow",
            className
          )}
        >
          <div className="mx-auto max-w-(--max-app-width) w-full flex grow gap-3 flex-wrap md:items-center justify-between px-3 lg:px-6 z-50 relative">
            <div className="flex grow gap-3 md:items-center">
              {icon && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 max-md:mt-0.5"
                  aria-hidden="true"
                >
                  {icon}
                </motion.div>
              )}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-sm flex space-y-0.5 flex-col"
              >
                <div className="font-medium whitespace-nowrap text-sm">
                  {title}
                </div>
                {typeof description === "string"
                  ? description.length > 0 && (
                      <p className="text-xs text-muted-foreground text-pretty truncate line-clamp-2">
                        {description}
                      </p>
                    )
                  : description}
              </motion.div>
            </div>
            <div className="min-w-[8rem] flex items-center gap-1 float-end">
              {actionComponent ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {actionComponent}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button
                    size="sm"
                    variant="outline"
                    effect="shineHover"
                    {...btnProps}
                    onClick={() => {
                      if (redirectUrl) {
                        window.open(redirectUrl, "_blank");
                      }
                    }}
                    className={cn(btnProps?.className)}
                  />
                </motion.div>
              )}
              {isClosable && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    variant="ghost"
                    size="icon_xs"
                    rounded="full"
                    className="group shrink-0 p-0 -mr-2 absolute right-2 left-auto top-1/2 -translate-y-1/2 hover:bg-transparent"
                    onClick={() => {
                      setIsBannerPanelClosed(true);
                      onClose?.();
                    }}
                    aria-label="Close banner"
                  >
                    <X
                      size={16}
                      strokeWidth={2}
                      className="opacity-60 transition-opacity group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
          <BorderBeam />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const bannerVariants = cva("relative w-full", {
  variants: {
    variant: {
      default: "bg-background border border-border",
      muted: "dark bg-muted",
      border: "border-b border-border",
    },
    size: {
      sm: "px-4 py-2",
      default: "px-4 py-3",
      lg: "px-4 py-3 md:py-2",
    },
    rounded: {
      none: "",
      default: "rounded-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
    rounded: "none",
  },
});

interface BannerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bannerVariants> {
  icon?: React.ReactNode;
  action?: React.ReactNode;
  onClose?: () => void;
  isClosable?: boolean;
  layout?: "row" | "center" | "complex";
}

const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  (
    {
      className,
      variant,
      size,
      rounded,
      icon,
      action,
      onClose,
      isClosable,
      layout = "row",
      children,
      ...props
    },
    ref
  ) => {
    const innerContent = (
      <div
        className={cn(
          "flex gap-2",
          layout === "center" && "justify-center",
          layout === "complex" && "md:items-center"
        )}
      >
        {layout === "complex" ? (
          <div className="flex grow gap-3 md:items-center">
            {icon && (
              <div className="flex shrink-0 items-center gap-3 max-md:mt-0.5">
                {icon}
              </div>
            )}
            <div
              className={cn(
                "flex grow",
                layout === "complex" &&
                  "flex-col justify-between gap-3 md:flex-row md:items-center"
              )}
            >
              {children}
            </div>
          </div>
        ) : (
          <>
            {icon && (
              <div className="flex shrink-0 items-center gap-3">{icon}</div>
            )}
            <div className="flex grow items-center justify-between gap-3">
              {children}
            </div>
          </>
        )}
        {(action || isClosable) && (
          <div className="flex items-center gap-3">
            {action}
            {isClosable && (
              <Button
                variant="ghost"
                className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
                onClick={onClose}
                aria-label="Close banner"
              >
                <X
                  size={16}
                  strokeWidth={2}
                  className="opacity-60 transition-opacity group-hover:opacity-100"
                  aria-hidden="true"
                />
              </Button>
            )}
          </div>
        )}
      </div>
    );

    return (
      <div
        ref={ref}
        className={cn(bannerVariants({ variant, size, rounded }), className)}
        {...props}
      >
        {innerContent}
      </div>
    );
  }
);
Banner.displayName = "Banner";

export { Banner, type BannerProps };
