/* istanbul ignore file */
import { injectable } from 'inversify';
import SimpleStore from '../SimpleStore';
import {
  FilterLineState,
  FilterPropertyState,
  FilterState,
} from './FilterState';

/**
 * Contains the current state of the filter.
 */
@injectable()
export default class FilterStateStore extends SimpleStore<FilterState> {
  protected getInitialValue(): FilterState {
    return { edges: [], nodes: [] };
  }

  /**
   * Toggles the {@link isActive} property of the specified filter line.
   * @param filterLineType - filter line which {@link isActive} property is toggled
   * @param entity - specifies whether this entity is a node or an edge
   */
  public toggleFilterLineActive(
    filterLineType: string,
    entity: 'node' | 'edge'
  ): void {
    const line: FilterLineState | undefined = this.getLineFromFilterState(
      filterLineType,
      entity
    );

    if (line) {
      line.isActive = !line.isActive;
    }

    this.setState(this.getValue());
  }

  /**
   * Adds a new {@link FilterPropertyState} to the specified filter line. If there already
   * exists a {@link FilterPropertyState} with the given name in the filter line, the
   * {@link FilterPropertyState} is overwritten with the new one.
   * @param stateToAdd - the {@link FilterPropertyState} to be added
   * @param filterLineType - filter line which the {@link FilterPropertyState} is added to
   * @param entity - specifies whether this entity is a node or an edge
   */
  public addFilterPropertyState(
    stateToAdd: FilterPropertyState,
    filterLineType: string,
    entity: 'node' | 'edge'
  ): void {
    const lineState: FilterLineState | undefined = this.getLineFromFilterState(
      filterLineType,
      entity
    );

    if (lineState) {
      const propertyWithExistentName = lineState.propertyFilters.find(
        (e) => e.name === stateToAdd.name
      );
      if (propertyWithExistentName) {
        propertyWithExistentName.values = stateToAdd.values;
      } else {
        lineState.propertyFilters.push(stateToAdd);
      }
    }

    this.setState(this.getValue());
  }

  /**
   * Gets the values of a {@link FilterPropertyState} in the specified filter line if they exist.
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
    const propertyState: FilterPropertyState | undefined =
      this.searchForPropertyState(filterLineType, filterPropertyName, entity);

    return propertyState?.values;
  }

  private getLineFromFilterState(
    filterLineType: string,
    entity: 'node' | 'edge'
  ): FilterLineState | undefined {
    const filterState = this.getValue();
    const entityLineStates =
      entity === 'node' ? filterState.nodes : filterState.edges;

    for (const entityLine of entityLineStates) {
      if (entityLine.type === filterLineType) {
        return entityLine;
      }
    }

    /* istanbul ignore next */
    return undefined;
  }

  private searchForPropertyState(
    filterLineType: string,
    filterPropertyName: string,
    entity: 'node' | 'edge'
  ) {
    const line: FilterLineState | undefined = this.getLineFromFilterState(
      filterLineType,
      entity
    );

    if (line) {
      for (const propertyFilters of line.propertyFilters) {
        if (propertyFilters.name === filterPropertyName) {
          return propertyFilters;
        }
      }
    }

    return undefined;
  }
}
