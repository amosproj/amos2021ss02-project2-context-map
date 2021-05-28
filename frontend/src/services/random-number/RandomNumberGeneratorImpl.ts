import { injectable } from 'inversify';
import RandomNumberGenerator from './RandomNumberGenerator';

@injectable()
export default class RandomNumberGeneratorImpl
  implements RandomNumberGenerator
{
  public next(minOrMax?: number, max?: number): number {
    // eslint-disable-next-line no-param-reassign
    max = max ?? 1.0;
    const min = minOrMax ?? 0.0;

    /* istanbul ignore next */
    if (min > max) {
      return NaN;
    }

    return min + Math.random() * (max - min);
  }
}
