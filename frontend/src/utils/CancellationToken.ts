/* eslint-disable max-classes-per-file */
import CancellationError from './CancellationError';
import nop from './nop';

export type CancellationTokenSubscriber = () => void;
export type CancellationTokenUnsubscribe = () => void;

/**
 * A cancellation token that can be passed to functions.
 */
export abstract class CancellationToken {
  /**
   * Get a boolean value indicating whether cancellation is requested.
   */
  public abstract get isCancellationRequested(): boolean;

  /**
   * Get a boolean value indicating whether cancellation can be requested.
   */
  public abstract get canGetCanceled(): boolean;

  /**
   * Throws a {@link CancellationError} if cancellation is requested.
   */
  public throwIfCancellationRequested(): void {
    if (this.isCancellationRequested) {
      throw new CancellationError();
    }
  }

  /**
   * Subscribes to the cancellation token.
   * @param subscriber A callback that gets triggered, when cancellation is requested.
   */
  public abstract subscribe(
    subscriber: CancellationTokenSubscriber
  ): CancellationTokenUnsubscribe;
}

class CancellationTokenImpl extends CancellationToken {
  private readonly source: CancellationTokenSource | null;

  public constructor(source: CancellationTokenSource | null) {
    super();
    this.source = source;
  }

  public get isCancellationRequested(): boolean {
    return this.source?.isCancellationRequested ?? false;
  }

  public get canGetCanceled(): boolean {
    return this.source !== null;
  }

  public subscribe(
    subscriber: CancellationTokenSubscriber
  ): CancellationTokenUnsubscribe {
    return this.source?.subscribe(subscriber) ?? nop;
  }
}

/**
 * A {@link CancellationToken} that cannot get canceled.
 */
export const None: CancellationToken = new CancellationTokenImpl(null);

/**
 * Represents a cancellation token source that manages a single cancellation token.
 */
export class CancellationTokenSource {
  private readonly storedToken: CancellationToken;

  private subscribers: CancellationTokenSubscriber[] = [];

  private internalIsCancellationRequested = false;

  constructor() {
    this.storedToken = new CancellationTokenImpl(this);
  }

  /**
   * Gets the cancellation token of this instance.
   */
  public get token(): CancellationToken {
    return this.storedToken;
  }

  /**
   * Get a boolean value indicating whether cancellation is requested.
   */
  public get isCancellationRequested(): boolean {
    return this.internalIsCancellationRequested;
  }

  /**
   * Subscribes to the cancellation token.
   * @param subscriber A callback that gets triggered, when cancellation is requested.
   */
  public subscribe(
    subscriber: CancellationTokenSubscriber
  ): CancellationTokenUnsubscribe {
    if (this.internalIsCancellationRequested) {
      subscriber();
      return nop;
    }

    this.subscribers.push(subscriber);
    return () => {
      this.subscribers = this.subscribers.filter((s) => s !== subscriber);
    };
  }

  /**
   * Requests cancellation.
   */
  public cancel(): void {
    this.internalIsCancellationRequested = true;
    this.subscribers.splice(0).forEach((subscriber) => subscriber());
  }
}
