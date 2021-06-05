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
  toggleNodeActiveState(name: string): void {
    // this.mergeState();
  }

  protected getInitialValue(): FilterState {
    return { edges: [], nodes: [] };
  }
}
