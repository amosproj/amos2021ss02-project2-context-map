import { Observable } from 'rxjs';
import CancellationError from './CancellationError';
import LoadingStore from '../stores/LoadingStore';

type Props = {
  loadingStore: LoadingStore;
};

/**
 * Pipe for observables that activates a loading backdrop as long as the
 * observable is active
 */
export default function withLoadingBar<T>(config: Props) {
  return (source: Observable<T>): Observable<T> =>
    new Observable<T>((subscriber) => {
      const sub = source.subscribe({
        next(x: T) {
          subscriber.next(x);
        },
        error(err: unknown) {
          config.loadingStore.removeLoader(sub);
          if (err instanceof CancellationError) {
            subscriber.complete();
            return;
          }
          subscriber.error(err);
        },
        complete() {
          config.loadingStore.removeLoader(sub);
          subscriber.complete();
        },
      });
      config.loadingStore.addLoader(sub);
      return () => sub.unsubscribe();
    });
}
