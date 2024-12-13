"use client";
import type React from "react";
import {
  Suspense,
  useEffect,
  useState
} from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactElement;
}

export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({
  children,
  fallback,
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
    return fallback;
  }

  return <>{children}</>;
};

interface ErrorBoundaryWithSuspenseProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
  loadingFallback: React.ReactNode;
}

export const ErrorBoundaryWithSuspense: React.FC<
  ErrorBoundaryWithSuspenseProps
> = ({ children, fallback, loadingFallback }) => {
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
    return fallback;
  }

  return (
    <Suspense fallback={loadingFallback}>
      {children}
    </Suspense>
  );
};
