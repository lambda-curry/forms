import { useEffect, useMemo, useRef } from 'react';
import { debounce } from '../lib/debounce';
import { useUnmount } from './use-unmount';

type DebounceOptions = {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
};

type ControlFunctions = {
  cancel: () => void;
  flush: () => void;
  isPending: () => boolean;
};

export type DebouncedState<T extends (...args: any[]) => any> = ((
  ...args: Parameters<T>
) => ReturnType<T> | undefined) &
  ControlFunctions;

export function useDebounceCallback<T extends (...args: any[]) => any>(
  func: T,
  delay = 500,
  options?: DebounceOptions,
): DebouncedState<T> {
  const debouncedFunc = useRef<(((...args: Parameters<T>) => ReturnType<T> | undefined) & ControlFunctions) | null>(
    null,
  );

  useUnmount(() => {
    if (debouncedFunc.current) {
      debouncedFunc.current.cancel();
    }
  });

  const debounced = useMemo(() => {
    const debouncedFuncInstance = debounce(func, delay, options);

    const wrappedFunc: DebouncedState<T> = (...args: Parameters<T>) => {
      return debouncedFuncInstance(...args);
    };

    wrappedFunc.cancel = () => {
      debouncedFuncInstance.cancel();
    };

    wrappedFunc.isPending = () => {
      return !!debouncedFunc.current;
    };

    wrappedFunc.flush = () => {
      return debouncedFuncInstance.flush();
    };

    return wrappedFunc;
  }, [func, delay, options]);

  // Update the debounced function ref whenever func, wait, or options change
  useEffect(() => {
    debouncedFunc.current = debounced;
  }, [debounced]);

  return debounced;
}
