"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ButtonLink } from "@/components/utils/link";
import { Clock, Home, Mail, RefreshCw, Server } from "lucide-react";
import { useEffect } from "react";
import { appConfig } from "~/project.config";

export default function ServerErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // posthog.captureException(error);

    // Log the error to an error reporting service
    console.error(error);
  }, [error]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-destructive/50 to-orange-100 dark:bg-gradient-to-br dark:from-red-900 dark:to-orange-900">
      <Card className="w-full max-w-md text-center border-destructive shadow-lg">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-destructive/50 border-4 border-destructive">
            <Server className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-2xl text-destructive">
            Server Error
          </CardTitle>
          <CardDescription className="text-destructive/80">
            We&apos;re experiencing technical difficulties on our end. Our team
            has been notified and is working to fix the issue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-destructive bg-destructive/20 p-3 rounded-lg border border-destructive">
            <div className="flex items-center gap-2 justify-center mb-2">
              <Server className="size-4" />
              <span>Error 500 - Internal Server Error</span>
            </div>
            <div className="flex items-center gap-2 justify-center text-xs">
              <Clock className="size-3" />
              <span>Please try again in a few minutes</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => window.location.reload()}
              variant="destructive"
            >
              <RefreshCw />
              Refresh Page
            </Button>
            <ButtonLink variant="outline" href="/dashboard">
              <Home />
              Go Home
            </ButtonLink>
          </div>
          <div className="pt-4 border-t border-destructive/20 space-y-2">
            <p className="text-xs text-destructive font-medium">
              Still having issues?
            </p>
            <div className="flex gap-2 justify-center">
              <ButtonLink variant="ghost" size="sm" href={appConfig.contact}>
                <Mail />
                Contact Support
              </ButtonLink>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
