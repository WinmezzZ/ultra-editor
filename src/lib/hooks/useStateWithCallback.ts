import { useEffect, useRef, useState, SetStateAction } from 'react';

type Callback<S> = (state: S) => void | (() => void | undefined);

export type DispatchWithCallback<A> = (value: A, callback?: Callback<A>) => void;

export const useStateWithCallback = <T>(initialState: T) => {
  const callbackRef = useRef<Callback<T> | null>(null);

  const [value, setValue] = useState(initialState);

  useEffect(() => {
    if (callbackRef.current) {
      callbackRef.current && callbackRef.current(value);

      callbackRef.current = null;
    }
  }, [value]);

  const setValueWithCallback = (newValue: T, callback: Callback<T>) => {
    callbackRef.current = callback;

    return setValue(newValue);
  };

  return [value, setValueWithCallback] as [T, DispatchWithCallback<SetStateAction<T>>];
};
