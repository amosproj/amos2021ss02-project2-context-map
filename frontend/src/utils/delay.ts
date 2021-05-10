import { CancellationToken, None } from './CancellationToken';
import CancellationError from './CancellationError';
import nop from './nop';

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
