"use client";
import React, {
  ReactElement,
  ReactNode,
  Suspense,
  useEffect,
  useState,
} from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactElement;
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
  children: ReactNode;
  fallback: ReactElement;
  loadingFallback: ReactElement;
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
      <React.Fragment>{children}</React.Fragment>
    </Suspense>
  );
};
