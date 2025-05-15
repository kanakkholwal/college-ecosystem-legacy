"use client";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";

interface ActionBarProps {
  className?: string;
  title: string;
  description?: React.ReactNode;
  btnProps: React.ComponentProps<typeof Button>;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  action: () => Promise<any>;
}

export function ActionBar({
  className,
  title,
  description,
  btnProps,
  action,
}: ActionBarProps) {
  const [loading, setLoading] = React.useState(false);

  const handleAction = async () => {
    try {
      setLoading(true);
      await toast.promise(action(), {
        loading: "Taking action...",
        success: (msg: string | undefined) => {
          return msg || "Action completed successfully";
        },
        error: (msg: string | undefined) => {
          return msg || "An error occurred while taking action";
        },
      });
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while taking action");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn("flex justify-between items-center w-full p-1", className)}
    >
      <div className="grid grid-cols-1">
        <Heading level={6}>{title}</Heading>
        {description}
      </div>
      <div className="flex items-center gap-2">
        <Button {...btnProps} disabled={loading} onClick={handleAction}>
          {loading ? (
            <>
              <LoaderCircle className="animate-spin" size={24} />
              Taking action...
            </>
          ) : (
            btnProps.children
          )}
        </Button>
      </div>
    </div>
  );
}
