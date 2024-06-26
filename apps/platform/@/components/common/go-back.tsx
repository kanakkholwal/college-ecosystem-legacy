"use client";
import { Button, ButtonProps } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function GoBackButton(props: ButtonProps) {
  const router = useRouter();
  return (
    <Button
      rounded="full"
      variant="default_light"
      onClick={() => {
        window?.history?.length > 1 ? router.back() : router.push("/");
      }}
      {...props}
    >
      <ArrowLeft />
      Go Back
    </Button>
  );
}
