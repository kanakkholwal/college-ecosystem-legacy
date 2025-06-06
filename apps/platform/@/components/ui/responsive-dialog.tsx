"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import React, { useMemo, useState } from "react";

export type ResponsiveDialogProps = {
  children: React.ReactNode;
  title: string | React.ReactNode;
  description: string | React.ReactNode;
  btnProps: React.ComponentProps<typeof Button>;
  defaultOpen?: boolean;
  onOpenChange?(open: boolean): void;
  className?: string;
};

const ResponsiveDialog = React.memo(
  ({
    title,
    description,
    children,
    btnProps,
    className,
    defaultOpen,
    onOpenChange,
  }: ResponsiveDialogProps) => {
    const [open, setOpen] = useState(defaultOpen || false);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const dialog = useMemo(() => {
      if (isDesktop) {
        return (
          <Dialog
            open={open}
            onOpenChange={(value) => {
              setOpen(value);
              onOpenChange?.(value);
            }}
          >
            <DialogTrigger asChild>
              <Button {...btnProps} />
            </DialogTrigger>
            <DialogContent
              className={cn("sm:max-w-[425px] @container/dialog", className)}
            >
              <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
              </DialogHeader>
              {children}
            </DialogContent>
          </Dialog>
        );
      }

      return (
        <Drawer
          open={open}
          onOpenChange={(value) => {
            setOpen(value);
            onOpenChange?.(value);
          }}
        >
          <DrawerTrigger asChild>
            <Button {...btnProps} />
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>{title}</DrawerTitle>
              <DrawerDescription>{description}</DrawerDescription>
            </DrawerHeader>
            <div className={cn("px-4 w-full @container/dialog", className)}>
              {children}
            </div>
            <DrawerFooter className="pt-2 justify-end">
              <DrawerClose asChild>
                <Button size="sm" variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      );
    }, [
      isDesktop,
      open,
      onOpenChange,
      btnProps,
      className,
      title,
      description,
      children,
    ]);

    return dialog;
  },
  (prevProps, nextProps) =>
    prevProps.title === nextProps.title &&
    prevProps.description === nextProps.description &&
    prevProps.btnProps === nextProps.btnProps &&
    prevProps.className === nextProps.className &&
    prevProps.defaultOpen === nextProps.defaultOpen &&
    prevProps.onOpenChange === nextProps.onOpenChange &&
    prevProps.children === nextProps.children
);

export { ResponsiveDialog };
