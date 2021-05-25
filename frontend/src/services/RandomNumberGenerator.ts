/* istanbul ignore file */

import { injectable } from 'inversify';
import 'reflect-metadata';

/**
 * Represents a random number generator used to access random numbers from a uniform distribution in a specified range.
 */
@injectable()
export default abstract class RandomNumberGenerator {
  /**
   * Retrieves the next random number in the specified range.
   * @param min The inclusive lower bound, or 0.0 if not specified.
   * @param max The exclusive upper bound, or 1.0 if not specified.
   * @returns A value in the range {@param min} to {@param max}, or NaN if {@param min} is greater than {@param max}.
   */
  public abstract next: {
    (min: number, max: number): number;
    (max: number): number;
    (): number;
  };
}
