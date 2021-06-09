import { Observable } from 'rxjs';

/**
 * Allows a value to be retrieved as-well as monitoring the value.
 */
export interface ValueMonitor<T> {
  /**
   * Returns an observable that outputs the stored value.
   */
  getState(): Observable<T>;

  /**
   * Returns the current value of the stored value.
   */
  getValue(): T;
}
