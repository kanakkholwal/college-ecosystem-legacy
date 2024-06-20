"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function GoBackButton(props: ButtonProps) {
  return (
    <Button
      rounded="full"
      variant="default_light"
      onClick={() => {
        window?.history?.back();
      }}
      {...props}
    >
      <ArrowLeft />
      Go Back
    </Button>
  );
}
