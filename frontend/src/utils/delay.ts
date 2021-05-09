import { CancellationToken, None } from './CancellationToken';
import CancellationError from './CancellationError';
import nop from './nop';

export default function delay(
  ms: number,
  cancellation: CancellationToken = None
): Promise<void> {
  return new Promise((resolve, reject) => {
    let unsubscribe = nop;
    const handle = setTimeout(() => {
      unsubscribe();
      resolve();
    }, ms);

    unsubscribe = cancellation.subscribe(() => {
      clearTimeout(handle);
      reject(new CancellationError());
    });
  });
}
