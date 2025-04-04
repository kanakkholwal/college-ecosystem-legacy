"use client";
import type React from "react";
import { Suspense, useEffect, useState } from "react";
import ErrorBanner from "@/components/utils/error";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  callback?: (error: Error) => void;
}

export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({
  children,
  fallback,
  callback,
}) => {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const errorHandler = (ev: ErrorEvent) => {
      setError(ev.error);
    };

    window.addEventListener("error", errorHandler);

    return () => {
      window.removeEventListener("error", errorHandler);
    };
  }, []);

  useEffect(() => {
    const unhandledRejectionHandler = (ev: PromiseRejectionEvent) => {
      setError(ev.reason);
    };

    window.addEventListener("unhandledrejection", unhandledRejectionHandler);

    return () => {
      window.removeEventListener(
        "unhandledrejection",
        unhandledRejectionHandler
      );
    };
  }, []);

  if (error) {
    console.error(error);
    callback?.(error);
    return fallback ? fallback : <ErrorBanner />;
  }

  return <>{children}</>;
};

interface ErrorBoundaryWithSuspenseProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loadingFallback: React.ReactNode;
  callback?: (error: Error) => void;
}

export const ErrorBoundaryWithSuspense: React.FC<
  ErrorBoundaryWithSuspenseProps
> = ({ children, fallback, loadingFallback, callback }) => {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const errorHandler = (ev: ErrorEvent) => {
      setError(ev.error);
    };

    window.addEventListener("error", errorHandler);

    return () => {
      window.removeEventListener("error", errorHandler);
    };
  }, []);

  useEffect(() => {
    const unhandledRejectionHandler = (ev: PromiseRejectionEvent) => {
      setError(ev.reason);
    };

    window.addEventListener("unhandledrejection", unhandledRejectionHandler);

    return () => {
      window.removeEventListener(
        "unhandledrejection",
        unhandledRejectionHandler
      );
    };
  }, []);

  if (error) {
    console.error(error);
    callback?.(error);
    return fallback ? fallback : <ErrorBanner />;
  }

  return <Suspense fallback={loadingFallback}>{children}</Suspense>;
};
