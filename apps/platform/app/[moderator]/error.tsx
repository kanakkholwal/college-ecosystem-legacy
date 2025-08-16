"use client";
import ErrorBanner from "@/components/utils/error";
import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service ? posthog, sentry, etc.
    // This is a good place to send the error to your error tracking service
    console.error(error);
  }, [error]);
  return (
    <div className="flex items-center justify-center w-full h-full">
      <ErrorBanner />
    </div>
  );
}
