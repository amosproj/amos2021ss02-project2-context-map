import { CancellationToken, None } from './CancellationToken';
import CancellationError from './CancellationError';
import nop from './nop';

/**
 * Delays for a specified period of time.
 * @param ms The period of time to delay in milliseconds.
 * @param cancellation A {@link CancellationToken} used to cancel the asynchronous operation.
 * @returns A {@link Promise} representing the asynchronous operation.
 */
export default function delay(
  ms: number,
  cancellation?: CancellationToken
): Promise<void> {
  return new Promise((resolve, reject) => {
    let unsubscribe = nop;
    const handle = setTimeout(() => {
      unsubscribe();
      resolve();
    }, ms);

    unsubscribe = (cancellation ?? None).subscribe(() => {
      clearTimeout(handle);
      reject(new CancellationError());
    });
  });
}
