import { useEffect, useState } from 'react';
import { Observable } from 'rxjs';

/**
 * A React hook that subscribes to a given observable as long as the
 * component is mounted.
 * Returns a stateful value like {@link useState}.
 * @param observable is subscribed on mount and unsubscribed on unmount
 * @param initialValue first state of the returned value.
 */
export function useObservable<T>(observable: Observable<T>, initialValue: T): T;

/**
 * A React hook that subscribes to a given observable as long as the
 * component is mounted.
 * Returns a stateful value like {@link useState}.
 * @param observable is subscribed on mount and unsubscribed on unmount
 */
export function useObservable<T>(observable: Observable<T>): T | undefined;

export function useObservable<T>(
  observable: Observable<T>,
  initialValue?: T
): T | undefined {
  const [value, setValue] = useState(initialValue);
  const [diff, setDiff] = useState(false);

  useEffect(() => {
    const sub = observable.subscribe({
      next: (next) => {
        setValue(next);
        // React performs a diff operation on its state and does not re-render if the state did not change
        // which can occur when we set the state to here to the exact same value as before. We however know
        // that we want to update and re-render, even if the object is the same (maybe its internal state changed)
        // or to just trigger a re-render anyway.
        setDiff(!diff);
      },
    });
    return () => sub.unsubscribe();
  }, []);

  return value;
}

export default useObservable;
