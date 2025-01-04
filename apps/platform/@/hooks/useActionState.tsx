import { useState, useTransition } from "react";

type ActionFunction<P extends any[], T> = (...args: P) => Promise<T>;

type ActionState<T> = {
  loading: boolean;
  error: Error | undefined;
  data: T | undefined;
};

type RunFunction<P extends any[], T> = (
  ...args: P
) => Promise<{ data?: T; error?: Error }>;

export function useActionState<P extends any[], T>(
  action: ActionFunction<P, T>
): [RunFunction<P, T>, ActionState<T>] {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<Error | undefined>(undefined);
  const [data, setData] = useState<T | undefined>(undefined);

  const run: RunFunction<P, T> = (...args: P) => {
    return new Promise((resolve) => {
      startTransition(async () => {
        try {
          setError(undefined);
          const result = await action(...args);
          setData(result);
          resolve({ data: result });
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err));
          setError(error);
          setData(undefined);
          resolve({ error });
        }
      });
    });
  };

  return [run, { loading: isPending, error, data }];
}
