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

  useEffect(() => {
    const sub = observable.subscribe({
      next: (next) => {
        setValue(next);
      },
    });
    return () => sub.unsubscribe();
  }, []);

  return value;
}

export default useObservable;
