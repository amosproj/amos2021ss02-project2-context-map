import { Observable } from 'rxjs';
import CancellationError from './CancellationError';
import ErrorStore from '../stores/ErrorStore';

type Props = {
  /**
   * If true, errors are handled and rethrown.
   * If false, errors are completely suppressed.
   * {@link CancellationError}s are always suppressed.
   * @default false
   */
  rethrow?: boolean;

  /**
   * Context specific error store
   */
  errorStore: ErrorStore;
};

/**
 * Returns a rxjs pipe that catches errors and forwards them to our error boundary.
 */
export default function withErrorHandler<T>(
  configParam: Props
): (observable: Observable<T>) => Observable<T> {
  const config: Required<Props> = { rethrow: false, ...configParam };

  return (observable: Observable<T>): Observable<T> =>
    new Observable<T>((subscriber) => {
      const subscription = observable.subscribe({
        next(value) {
          subscriber.next(value);
        },
        error(err) {
          if (!(err instanceof CancellationError)) {
            config.errorStore.setState(err);
          }
          if (config.rethrow) {
            subscriber.error(err);
          }
        },
        complete() {
          subscriber.complete();
        },
      });

      // Return the teardown logic. This will be invoked when
      // the result errors, completes, or is unsubscribed.
      return () => {
        subscription.unsubscribe();
      };
    });
}
