import { injectable } from 'inversify';
import SimpleStore from './SimpleStore';

export interface FilterPropertyState {
  name: string;
  values: string[];
}

export interface FilterLineState {
  type: string;
  isActive: boolean;
  propertyFilters: FilterPropertyState[];
}

export interface FilterState {
  edges: FilterLineState[];
  nodes: FilterLineState[];
}

@injectable()
export default class FilterStateStore extends SimpleStore<FilterState> {
  protected getInitialValue(): FilterState {
    return { edges: [], nodes: [] };
  }

  public toggleFilterLineActive(
    filterLineType: string,
    entity: 'node' | 'edge'
  ): void {
    const line: FilterLineState | undefined = this.searchForLineState(
      filterLineType,
      entity
    );

    if (line) {
      line.isActive = !line.isActive;
    }
  }

  public addFilterPropertyState(
    stateToAdd: FilterPropertyState,
    filterLineType: string,
    entity: 'node' | 'edge'
  ): void {
    const lineState: FilterLineState | undefined = this.searchForLineState(
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

  public getPropertyStateValues(
    filterLineType: string,
    filterPropertyName: string,
    entity: 'node' | 'edge'
  ): string[] | undefined {
    const propertyState: FilterPropertyState | undefined =
      this.searchForPropertyState(filterLineType, filterPropertyName, entity);

    return propertyState ? propertyState.values : undefined;
  }

  private searchForLineState(
    filterLineType: string,
    entity: 'node' | 'edge'
  ): FilterLineState | undefined {
    let result: FilterLineState | undefined;

    const filterState = this.getValue();
    const entityLineStates =
      entity === 'node' ? filterState.nodes : filterState.edges;

    for (const entityLine of entityLineStates) {
      if (entityLine.type === filterLineType) {
        result = entityLine;
        break;
      }
    }

    return result;
  }

  private searchForPropertyState(
    filterLineType: string,
    filterPropertyName: string,
    entity: 'node' | 'edge'
  ) {
    let result: FilterPropertyState | undefined;

    const line: FilterLineState | undefined = this.searchForLineState(
      filterLineType,
      entity
    );

    if (line) {
      for (const propertyFilters of line.propertyFilters) {
        if (propertyFilters.name === filterPropertyName) {
          result = propertyFilters;
        }
      }
    }
    return result;
  }
}
