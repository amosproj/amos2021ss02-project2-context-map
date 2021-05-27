import { RandomNumberGenerator } from '../../src/services/random-number';

export default class RandomNumberGeneratorFake
  implements RandomNumberGenerator
{
  private value: number;

  public constructor(value: number) {
    this.value = value;
  }

  public next(minOrMax?: number, max?: number): number {
    // eslint-disable-next-line no-param-reassign
    max = max ?? 1.0;
    const min = minOrMax ?? 0.0;

    if (min > max) {
      return NaN;
    }

    return this.value;
  }
}
