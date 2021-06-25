/* istanbul ignore file */
import { injectable } from 'inversify';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import SimpleStore from '../SimpleStore';
import { FilterPropertyState, FilterState } from './FilterState';

/**
 * Contains the current state of the filter.
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
   * Toggles the {@link isActive} property of the specified filter line of the store value.
   * Updates the state of the store afterwards.
   * @param filterLineType - filter line which {@link isActive} property is toggled
   * @param entity - specifies whether this entity is a node or an edge
   */
  public toggleFilterLineActive(
    filterLineType: string,
    entity: 'node' | 'edge'
  ): void {
    this.getValue().toggleFilterLineActive(filterLineType, entity);

    this.setState(this.getValue());
  }

  /**
   * Sets the {@link isActive} property of the specified filter line active of the store value.
   * Updates the state of the store afterwards.
   * @param filterLineType - filter line which {@link isActive} property is set active
   * @param entity - specifies whether this entity is a node or an edge
   */
  public setFilterLineActive(
    filterLineType: string,
    entity: 'node' | 'edge'
  ): void {
    this.getValue().setFilterLineActive(filterLineType, entity);

    this.setState(this.getValue());
  }

  /**
   * Replaces {@link FilterPropertyState}s of the specified filter line of the store value.
   * Updates the state of the store afterwards.
   * @param statesToReplace - the {@link FilterPropertyState}s to be replaced
   * @param filterLineType - filter line which the {@link FilterPropertyState} is added to
   * @param entity - specifies whether this entity is a node or an edge
   */
  public replaceFilterPropertyStates(
    statesToReplace: FilterPropertyState[],
    filterLineType: string,
    entity: 'node' | 'edge'
  ): void {
    this.getValue().replaceFilterPropertyStates(
      statesToReplace,
      filterLineType,
      entity
    );

    this.setState(this.getValue());
  }

  /**
   * Gets {@link FilterPropertyState}s of the specified filter line of the store value.
   * Updates the state of the store afterwards.
   * @param filterLineType - filter line which the {@link FilterPropertyState} is added to
   * @param entity - specifies whether this entity is a node or an edge
   */
  public getFilterPropertyStates(
    filterLineType: string,
    entity: 'node' | 'edge'
  ): FilterPropertyState[] | undefined {
    return this.getValue().getFilterPropertyStates(filterLineType, entity);
  }

  /**
   * Gets the values of a {@link FilterPropertyState} in the specified filter line of the store value if they exist.
   * Updates the state of the store afterwards.
   * Otherwise undefined is returned.
   * @param filterLineType - filter line which is searched for
   * @param filterPropertyName - name of the {@link FilterPropertyState}
   * @param entity - specifies whether this entity is a node or an edge
   */
  public getPropertyStateValues(
    filterLineType: string,
    filterPropertyName: string,
    entity: 'node' | 'edge'
  ): string[] | undefined {
    return this.getValue().getPropertyStateValues(
      filterLineType,
      filterPropertyName,
      entity
    );
  }
}
