import { MutableRefObject, useEffect, useRef } from "react";

export function usePrevious<T>(value: T): MutableRefObject<T | undefined>["current"] {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export function useOnChange<T>(value: T, callback: (value: T, previousValue?: T) => void): void {
  const previousValue = usePrevious(value);
  useEffect(() => {
    if (previousValue !== value) {
      callback(value, previousValue);
    }
  }, [value, callback, previousValue]);
}
