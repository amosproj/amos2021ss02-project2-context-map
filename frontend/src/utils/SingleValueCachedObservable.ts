import { OperatorFunction } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import CachedObservable, {
  ExtendedObservableNotification,
} from './CachedObservable';

/**
 * The cached value is the first value emitted from the given source observable.
 * @see CachedObservable
 */
export default class SingleValueCachedObservable<T> extends CachedObservable<
  T,
  T
> {
  /**
   * Stops the pipeline after the first successful value comes in.
   * @inheritDoc
   */
  protected onNewValue(): OperatorFunction<
    ExtendedObservableNotification<T>,
    ExtendedObservableNotification<T>
  > {
    // Stops observing the original observable when a value is emitted.
    return takeWhile((state) => state.kind !== 'N', true);
  }
}
