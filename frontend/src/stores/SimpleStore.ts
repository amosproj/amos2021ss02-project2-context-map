import { BehaviorSubject, Observable } from 'rxjs';

export default abstract class SimpleStore<T> {
  protected readonly storeSubject = new BehaviorSubject<T>(
    this.getInitialValue()
  );

  /**
   * Returns the initial value of the stored subject.
   * @protected
   */
  protected abstract getInitialValue(): T;

  /**
   * Returns an observable that outputs the stored value.
   */
  public getState(): Observable<T> {
    return this.storeSubject.pipe();
  }

  /**
   * Updates the current filter by replacing it completely.
   */
  public setState(newState: T): void {
    this.storeSubject.next(newState);
  }

  /**
   * Updates the current filter by merging it with the current value.
   */
  public mergeState(newState: Partial<T>): void {
    this.storeSubject.next({ ...this.storeSubject.value, ...newState });
  }
}
