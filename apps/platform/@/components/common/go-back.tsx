"use client";
import { Button, type ButtonProps } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export function GoBackButton(props: ButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <Button
      rounded="full"
      variant="default_light"
      onClick={() => {
        window?.history?.length > 1
          ? router.back()
          : router.push(pathname.split("/").splice(-1).join("/"));
      }}
      {...props}
    >
      <ArrowLeft />
      Go Back
    </Button>
  );
}
