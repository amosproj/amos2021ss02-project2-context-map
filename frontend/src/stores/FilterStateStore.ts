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

  public addFilterPropertyState(
    stateToAdd: FilterPropertyState,
    filterLineType: string,
    entity: 'node' | 'edge'
  ): void {
    const line: FilterLineState | undefined = this.searchForLine(
      filterLineType,
      entity
    );

    if (line) {
      const propertyWithExistentName = line.propertyFilters.find(
        (e) => e.name === stateToAdd.name
      );
      if (propertyWithExistentName) {
        propertyWithExistentName.values = stateToAdd.values;
      } else {
        line.propertyFilters.push(stateToAdd);
      }
    }

    this.setState(this.getValue());
  }

  private searchForLine(
    type: string,
    entity: 'node' | 'edge'
  ): FilterLineState | undefined {
    let result: FilterLineState | undefined;

    const filterState = this.getValue();
    const entityLineStates =
      entity === 'node' ? filterState.nodes : filterState.edges;

    for (const entityLine of entityLineStates) {
      if (entityLine.type === type) {
        result = entityLine;
        break;
      }
    }

    return result;
  }
}
