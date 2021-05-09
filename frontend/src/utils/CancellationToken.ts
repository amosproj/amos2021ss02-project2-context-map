/* eslint-disable max-classes-per-file */
import CancellationError from './CancellationError';
import nop from './nop';

export type CancellationTokenSubscriber = () => void;
export type CancellationTokenUnsubscribe = () => void;

export abstract class CancellationToken {
  public abstract get isCancellationRequested(): boolean;

  public abstract subscribe(
    subscriber: CancellationTokenSubscriber
  ): CancellationTokenUnsubscribe;
}

export class CancellationTokenImpl extends CancellationToken {
  private readonly source: CancellationTokenSource | null;

  public constructor(source: CancellationTokenSource | null) {
    super();
    this.source = source;
  }

  public get isCancellationRequested(): boolean {
    return this.source?.isCancellationRequested ?? false;
  }

  public throwIfCancellationRequested(): void {
    if (this.isCancellationRequested) {
      throw new CancellationError();
    }
  }

  public subscribe(
    subscriber: CancellationTokenSubscriber
  ): CancellationTokenUnsubscribe {
    return this.source?.subscribe(subscriber) ?? nop;
  }
}

export const None: CancellationToken = new CancellationTokenImpl(null);

export class CancellationTokenSource {
  private readonly storedToken: CancellationToken;

  private subscribers: CancellationTokenSubscriber[] = [];

  private internalIsCancellationRequested = false;

  constructor() {
    this.storedToken = new CancellationTokenImpl(this);
  }

  public get token(): CancellationToken {
    return this.storedToken;
  }

  public get isCancellationRequested(): boolean {
    return this.internalIsCancellationRequested;
  }

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

  public cancel(): void {
    this.internalIsCancellationRequested = true;
    this.subscribers.splice(0).forEach((subscriber) => subscriber());
  }
}
