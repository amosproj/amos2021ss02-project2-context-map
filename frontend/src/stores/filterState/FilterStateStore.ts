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

  public addFilterPropertyState(
    stateToAdd: FilterPropertyState,
    filterLineType: string,
    entity: 'node' | 'edge'
  ): void {
    this.getValue().addFilterPropertyState(stateToAdd, filterLineType, entity);

    this.setState(this.getValue());
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
