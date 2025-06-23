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
    <div className="flex items-center justify-center w-full h-full space-y-10 flex-col max-w-5xl mx-auto mt-20">
      <ErrorBanner 
        title="Oops! Something went wrong"
        description="If you had UMC(unfair means) or result not on the college site then it can't be helped, otherwise Try instructions below"
      />
      <Alert>
        <Terminal className="size-4" />
        <AlertTitle>
          If you had UMC(unfair means) or result not on the college site then it
          can{"'"}t be helped,otherwise Try instructions below
        </AlertTitle>
        <AlertDescription>
          <ol className="list-decimal pl-5 prose prose-sm">
            <li>
              Open the following URL in your browser:
            </li>
            <li> To update an existing result, open:
              <a
                href={`${pathname}?update=true`}
                className="bg-primary/10 text-primary underline p-2 rounded"
              >
                {pathname}?update=true
              </a>
            </li>
            <li>
              If you want to add a new result, open:
              <a
                href={`${pathname}?new=true`}
                className="bg-primary/10 text-primary underline p-2 rounded"
              >
                {pathname}?new=true
              </a>
            </li>
            <li>
              After that, visit:
              <a
                href={`/results?cache=new`}
                className="bg-primary/10 text-primary underline p-2 rounded"
              >
                /results?cache=new
              </a>
            </li>
          </ol>
          <p className="text-sm text-muted-foreground mt-2">
            If you are still facing issues, please contact the support team.
          </p>
        </AlertDescription>
      </Alert>
    </div>
  );
}
