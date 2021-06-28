/* istanbul ignore file */
import { injectable } from 'inversify';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import SimpleStore from '../SimpleStore';
import { FilterState } from './FilterState';

/**
 * Contains the current state of the filter. Note that the underlying {@link FilterState} contains
 * methods that only change a copy of the underlying {@link FilterState}. To change the state of this
 * store, {@link FilterStateStore.setState} has to be called with the new {@link FilterState},
 * or {@link transformState} has to be used.
 */
@injectable()
export default class FilterStateStore extends SimpleStore<FilterState> {
  protected getInitialValue(): FilterState {
    return new FilterState([], []);
  }

  public getValue(): FilterState {
    const json = super.getValue();
    return new FilterState(json.edges, json.nodes);
  }

  public getState(): Observable<FilterState> {
    return super
      .getState()
      .pipe(map((next) => new FilterState(next.edges, next.nodes)));
  }

  /**
   * Transforms the current state of the store by applying transform it.
   * @param transform - function to be applied on the current state of the store.
   */
  public transformState(
    transform: (arg: FilterState) => FilterState | void
  ): void {
    const localValue = this.getValue();
    const transformed = transform(localValue);
    const transformedState =
      transformed instanceof Object ? transformed : localValue;
    this.setState(transformedState);
  }
}
