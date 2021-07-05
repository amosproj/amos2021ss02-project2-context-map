import { BehaviorSubject, Observable } from 'rxjs';
import 'reflect-metadata';
import { injectable } from 'inversify';

/**
 * A simple store contains a single state.
 * The current state can be retrieved with {@link getValue} (just once)
 * and with {@link getState} (until unsubscribed).
 */
@injectable()
export default abstract class SimpleStore<T> {
  private initialized = false;
  /**
   * Contains the state.
   * Returns the current state immediately after subscribing.
   * @protected
   */
  protected readonly storeSubject = new BehaviorSubject<T>(
    this.getInitialValue()
  );

  /**
   * Returns the initial value of the stored subject.
   * @protected
   */
  protected abstract getInitialValue(): T;

  /**
   * Ensures that the store is initialized. This is called on every action on
   * the store and has to ensure that the initialization is only done once.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected ensureInit(): void {}

  /**
   * Returns an observable that outputs the stored value.
   */
  public getState(): Observable<T> {
    if (!this.initialized) {
      this.initialized = true;
      this.ensureInit();
    }

    return this.storeSubject.pipe();
  }

  /**
   * Returns the current value of the stored value.
   */
  public getValue(): T {
    if (!this.initialized) {
      this.initialized = true;
      this.ensureInit();
    }
    return this.storeSubject.value;
  }

  /**
   * Updates the current filter by replacing it completely.
   */
  public setState(newState: T): void {
    if (!this.initialized) {
      this.initialized = true;
      this.ensureInit();
    }
    this.storeSubject.next(newState);
  }

  /**
   * Updates the current filter by merging it with the current value.
   */
  public mergeState(newState: Partial<T>): void {
    if (!this.initialized) {
      this.initialized = true;
      this.ensureInit();
    }
    this.setState({ ...this.getValue(), ...newState });
  }
}
