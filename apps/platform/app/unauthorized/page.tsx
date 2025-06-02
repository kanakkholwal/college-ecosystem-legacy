
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import NotFoundImg from "./404.svg";
import { RedirectButton } from "./client";

export const metadata: Metadata = {
  title: "Not Authorized",
  description: "You are not authorized to view this page.",
};

export default function NotAuthorized() {
  return (
    <>
      <div className="flex flex-col justify-center items-center text-center p-4 w-full h-full gap-4 max-h-screen py-24">
        <h2 className="text-5xl font-bold text-foreground">
          Stop right there!
        </h2>
        <p className="text-md  text-muted-foreground mt-5 text-pretty">
          You are not authorized to view this page. 
          Please sign in with an authorized account to access this page.
        </p>
        <Image
          className="w-full h-80 my-4"
          src={NotFoundImg}
          alt="403 Not Authorized"
          height={500}
          width={500}
          priority
        />
        <div className="flex mx-auto gap-4">
          <Button rounded="full" variant="default_light" effect="shineHover" width="sm" asChild>
            <Link href="/">
              <Home />
              Go to Home
            </Link>
          </Button>
          <RedirectButton />
        </div>
      </div>
    </>
  );
}
