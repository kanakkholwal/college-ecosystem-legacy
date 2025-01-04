import { type RefObject, useEffect, useRef } from "react";

export const useRefWithFocus = <T extends HTMLElement>(): RefObject<T> => {
  const ref = useRef<T>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, [ref]);

  return ref as RefObject<T>;
};
