import { Observable, OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';
import CachedObservable, {
  ExtendedObservableNotification,
} from './CachedObservable';

export type CachedMergeObservableCache<T> = {
  [key: number]: T;
};

/**
 * TODO
 */
export default class CachedMergeObservable<T> extends CachedObservable<
  T[],
  CachedMergeObservableCache<T>
> {
  private readonly state: CachedMergeObservableCache<T> = {};

  public getState(): CachedMergeObservableCache<T> {
    return this.state;
  }

  /**
   * @see {@link CachedObservable}
   * @param idOf TODO
   * @param source Observable or Promise-Factory
   */
  constructor(
    private idOf: (element: T) => number,
    source: Observable<T[]> | (() => Promise<T[]>)
  ) {
    super(source);
  }

  protected onNewValue(): OperatorFunction<
    ExtendedObservableNotification<T[]>,
    ExtendedObservableNotification<CachedMergeObservableCache<T>>
  > {
    return map((next) => {
      if (next.kind === 'N') {
        const val = next.value;
        for (const element of val) {
          this.state[this.idOf(element)] = element;
        }
      }
      return { ...next, value: this.state };
    });
  }
}
