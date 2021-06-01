import { useEffect } from 'react';
import { Observable } from 'rxjs';

/**
 * A React hook that subscribes to a given observable as long as the
 * component is mounted.
 * @param observable is subscribed on mount and unsubscribed on unmount
 */
export default function useObservable(observable: Observable<unknown>): void {
  useEffect(() => {
    const sub = observable.subscribe();
    return () => sub.unsubscribe();
  }, []);
}
