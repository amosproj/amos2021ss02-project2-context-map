import { OperatorFunction } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import CachedObservable, {
  ExtendedObservableNotification,
} from './CachedObservable';

/**
 * TODO Comment
 */
export default class SimpleCachedObservable<T> extends CachedObservable<T, T> {
  protected onNewValue(): OperatorFunction<
    ExtendedObservableNotification<T>,
    ExtendedObservableNotification<T>
  > {
    // Stops observing the original observable when a value is emitted.
    return takeWhile((state) => state.kind !== 'N', true);
  }
}
