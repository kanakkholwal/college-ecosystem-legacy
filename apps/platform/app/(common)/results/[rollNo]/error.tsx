"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ErrorBanner from "@/components/utils/error";
import { Terminal } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);
  return (
    <div className="flex items-center justify-center w-full h-full space-y-10 flex-col">
      <ErrorBanner />
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>
          If you had UMC(unfair means) or result not on the college site then it
          can{"'"}t be helped,otherwise Try instructions below
        </AlertTitle>
        <AlertDescription>
          <p>
            Open This like{" "}
            <a
              href={`${process.env.NEXT_PUBLIC_BASE_URL}${pathname}?update=true`}
              className="bg-primary/10 text-primary underline p-2 rounded"
            >
              {process.env.NEXT_PUBLIC_BASE_URL}
              {pathname}?update=true
            </a>{" "}
            for Result update.
          </p>
          <p>
            Open This like{" "}
            <a
              href={`${process.env.NEXT_PUBLIC_BASE_URL}${pathname}?new=true`}
              className="bg-primary/10 text-primary underline p-2 rounded"
            >
              {process.env.NEXT_PUBLIC_BASE_URL}
              {pathname}?update=true
            </a>{" "}
            for new Result to be added.
          </p>
          <p>
            Then Open{" "}
            <a
              href={`${process.env.NEXT_PUBLIC_BASE_URL}/results?cache=new`}
              className="bg-primary/10 text-primary underline p-2 rounded"
            >
              {process.env.NEXT_PUBLIC_BASE_URL}/results
            </a>{" "}
            to see changes
          </p>
        </AlertDescription>
      </Alert>
    </div>
  );
}
