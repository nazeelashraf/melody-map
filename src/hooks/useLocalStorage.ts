import { useState, useEffect, useRef, useCallback } from 'react';

export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const isClient = typeof window !== 'undefined';

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (!isClient) return defaultValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue(prev => {
      const nextValue = value instanceof Function ? value(prev) : value;
      return nextValue;
    });
  }, []);

  useEffect(() => {
    if (!isClient) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      try {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        console.warn(`useLocalStorage: failed to write "${key}"`, error);
      }
    }, 500);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [key, storedValue, isClient]);

  const clearValue = useCallback(() => {
    if (!isClient) return;
    window.localStorage.removeItem(key);
    setStoredValue(defaultValue);
  }, [key, defaultValue, isClient]);

  return [storedValue, setValue, clearValue];
}
