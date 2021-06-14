/* istanbul ignore file */

import {
  defer,
  Observable,
  ObservableNotification,
  OperatorFunction,
  Subject,
} from 'rxjs';
import {
  delayWhen,
  dematerialize,
  filter,
  materialize,
  repeatWhen,
  shareReplay,
  startWith,
} from 'rxjs/operators';

/**
 * LoadingNotification like {@link ObservableNotification}.
 */
export interface LoadingNotification {
  kind: 'L';
}

/**
 * Extends {@link ObservableNotification} with {@link LoadingNotification}.
 */
export type ExtendedObservableNotification<T> =
  | ObservableNotification<T>
  | LoadingNotification;

/**
 * Returns true if param is {@link ObservableNotification}.
 */
export function isObservableNotification<T>(
  state: ExtendedObservableNotification<T>
): state is ObservableNotification<T> {
  return state.kind === 'N' || state.kind === 'E' || state.kind === 'C';
}

/**
 * Observable with a cache.
 * The source observable is only subscribed to after this observable
 * is subscribed to (lazy evaluation).
 * The cached value is depends on the implementation.
 * If an error happens, the error is forwarded to all active subscribers.
 * The source action is automatically restarted after an error when a new
 * subscription is made.
 */
export default abstract class CachedObservable<In, Out> {
  /**
   * Empty subject. Emits value when a new subscription is made.
   * @see get
   * @private
   */
  private readonly newSubscriptionIncoming = new Subject<void>();

  /**
   * The main source observable with materialized state.
   * @private
   */
  private readonly observable: Observable<ExtendedObservableNotification<Out>>;

  /**
   * @see {@link CachedObservable}
   * @param source Observable or Promise-Factory (latter ensures a lazy start
   * of the promise, i.e. at the first subscription)
   */
  constructor(source: Observable<In> | (() => Promise<In>)) {
    if (typeof source === 'function') {
      // Defer is used here to delay the creation of the promise.
      // The Promise is created at the first subscription.
      // For observables this delay is not required since it's the
      // default behaviour.
      // eslint-disable-next-line no-param-reassign
      source = defer(source);
    }

    const start: LoadingNotification = { kind: 'L' };

    this.observable = source.pipe(
      // Adds state.
      materialize(),
      // Sets start value = loading (also start value after restart).
      startWith(start),
      // Repeats value when a new subscriber comes in. Is only called when idle.
      repeatWhen((obs) =>
        obs.pipe(delayWhen(() => this.newSubscriptionIncoming))
      ),
      this.onNewValue(),
      // Stores the last state.
      shareReplay(1)
    );
  }

  /**
   * Called for each new value of the observable.
   * @protected
   */
  protected abstract onNewValue(): OperatorFunction<
    ExtendedObservableNotification<In>,
    ExtendedObservableNotification<Out>
  >;

  /**
   * Returns the cached observable.
   * If the last emitted value was an error, it automatically restarts
   * the pipeline.
   */
  public get(): Observable<Out> {
    // Defer is used here to delay the call `this.newSubscriptionIncoming.next()`.
    // That ensures that the cache is properly retried if it's subscribed to
    // after an error.
    return defer(() => {
      // This code is called when a new subscription is made

      // Notify subject. Might go into the void.
      this.newSubscriptionIncoming.next();
      // Returns the cached value if one is there
      return this.observable.pipe(
        filter(isObservableNotification),
        dematerialize()
      );
    });
  }
}
