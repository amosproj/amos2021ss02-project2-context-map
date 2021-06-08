// TODO #249: Re-add ignored functions in QueryServiceImpl.ts to coverage when used #249
/* istanbul ignore file */

import { Observable, OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';
import { LRUMap } from 'lru_map';
import CachedObservable, {
  ExtendedObservableNotification,
} from './CachedObservable';

export type KeyedCache<T> = LRUMap<number, T>;

/**
 * Number of cached elements.
 */
const CACHE_SIZE = 1000;

/**
 * Caches keyed values in it's state.
 * The maximum number of elements in the cache is limited by {@link CACHE_SIZE}.
 */
export default class KeyedCacheObservable<T> extends CachedObservable<
  T[],
  KeyedCache<T>
> {
  /**
   * State of the cache.
   * @private
   */
  private readonly state: KeyedCache<T> = new LRUMap<number, T>(CACHE_SIZE);

  /**
   * Returns the current state of the cache.
   */
  public getState(): KeyedCache<T> {
    return this.state;
  }

  /**
   * @see {@link KeyedCacheObservable}
   * @see {@link CachedObservable}
   * @param keyOf Function that returns an key for an element to store. (e.g. `(element) => element.id;`)
   * @param source Observable or Promise-Factory (latter ensures a lazy start
   * of the promise, i.e. at the first subscription)
   */
  constructor(
    private keyOf: (element: T) => number,
    source: Observable<T[]> | (() => Promise<T[]>)
  ) {
    super(source);
  }

  protected onNewValue(): OperatorFunction<
    ExtendedObservableNotification<T[]>,
    ExtendedObservableNotification<KeyedCache<T>>
  > {
    return map((next) => {
      if (next.kind === 'N') {
        const val = next.value;
        for (const element of val) {
          this.state.set(this.keyOf(element), element);
        }
      }
      return { ...next, value: this.state };
    });
  }
}
