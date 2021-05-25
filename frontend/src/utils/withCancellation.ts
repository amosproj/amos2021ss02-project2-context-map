import CancellationError from './CancellationError';
import { CancellationToken } from './CancellationToken';

export default function withCancellation<T>(
  promise: Promise<T>,
  cancellation?: CancellationToken
): Promise<T> {
  if (!cancellation || !cancellation.canGetCanceled) {
    return promise;
  }

  return new Promise<T>((resolve, reject) => {
    let promiseCanceled = false;
    const cancellationUnsubscribe = cancellation.subscribe(() => {
      reject(new CancellationError());
      promiseCanceled = true;
    });

    promise.then((result) => {
      cancellationUnsubscribe();
      if (!promiseCanceled) {
        resolve(result);
      }
    });

    promise.catch((reason) => {
      cancellationUnsubscribe();
      /* istanbul ignore file */
      if (!promiseCanceled) {
        reject(reason);
      }
    });
  });
}
