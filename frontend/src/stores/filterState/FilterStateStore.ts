/* istanbul ignore file */
import { injectable } from 'inversify';
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

  public toggleFilterLineActive(
    filterLineType: string,
    entity: 'node' | 'edge'
  ): void {
    this.getValue().toggleFilterLineActive(filterLineType, entity);

    this.setState(this.getValue());
  }

  public setFilterLineActive(
    filterLineType: string,
    entity: 'node' | 'edge'
  ): void {
    this.getValue().setFilterLineActive(filterLineType, entity);

    this.setState(this.getValue());
  }
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

  public getFilterPropertyStates(
    filterLineType: string,
    entity: 'node' | 'edge'
  ): FilterPropertyState[] | undefined {
    return this.getValue().getFilterPropertyStates(filterLineType, entity);
  }

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
