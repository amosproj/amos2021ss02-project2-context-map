import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import {
  FilterCondition,
  FilterQuery,
  MatchAllCondition,
  MatchAnyCondition,
  MatchPropertyCondition,
  OfTypeCondition,
} from '../shared/queries';
import SimpleStore from './SimpleStore';
import {
  FilterLineState,
  FilterPropertyState,
  FilterState,
} from './filterState/FilterState';
import FilterStateStore from './filterState/FilterStateStore';

/**
 * Contains the current state of the filterQuery.
 */
@injectable()
export default class FilterQueryStore extends SimpleStore<FilterQuery> {
  @inject(FilterStateStore)
  private readonly filterStateStore!: FilterStateStore;

  protected getInitialValue(): FilterQuery {
    return {
      limits: { edges: 150, nodes: 200 },
      includeSubsidiary: true,
    };
  }

  /**
   * Updates the state of the filterQuery by synchronizing it with the {@link FilterStateStore}.
   */
  update(): void {
    const filter = this.filterStateStore.getValue();
    const filterQuery = this.convertToFilterQuery(filter);
    this.mergeState(filterQuery);
  }

  /**
   * Converts a {@link FilterState} given from the users input to a {@link FilterQuery}.
   * @param filterState - the {@link FilterState} to be converted
   * @returns {@link FilterQuery} as conversion result
   * @private
   */
  private convertToFilterQuery(filterState: FilterState): FilterQuery {
    const createEntityCondition = (filterLineStates: FilterLineState[]) => {
      const entityConditions: FilterCondition[] = [];

      for (const filterLineState of filterLineStates) {
        // collect from filter line

        if (filterLineState.isActive) {
          const propertyConditions: FilterCondition[] =
            this.convertToPropertyConditions(filterLineState.propertyFilters);

          // add the ofTypeCondition to the entity
          const ofTypeCondition = OfTypeCondition(filterLineState.type);
          const lineCondition: FilterCondition =
            propertyConditions.length > 0
              ? MatchAllCondition(
                  ofTypeCondition,
                  MatchAllCondition(...propertyConditions)
                )
              : ofTypeCondition;

          entityConditions.push(lineCondition);
        }
      }
      return MatchAnyCondition(...entityConditions);
    };

    return {
      filters: {
        nodes: createEntityCondition(filterState.nodes),
        edges: createEntityCondition(filterState.edges),
      },
    };
  }

  /**
   * Converts an Array of raw {@link FilterPropertyState}s given from the users input
   * in a {@link FilterLineProperties} to {@link FilterCondition}s representing the properties of an entity.
   * @param propertyFilters - the {@link FilterPropertyState}s to be converted
   * @returns {@link FilterCondition}s representing the properties of an entity.
   * @private
   */
  private convertToPropertyConditions(
    propertyFilters: FilterPropertyState[]
  ): FilterCondition[] {
    const propertyConditions: FilterCondition[] = [];

    for (const propertyFilter of propertyFilters) {
      // collect from dialog
      // There is a filter specified for the property

      if (propertyFilter.values?.length > 0) {
        // If only a single value is specified in the filter, add this directly
        // Example: name=Peter
        if (propertyFilter.values.length === 1) {
          propertyConditions.push(
            MatchPropertyCondition(
              propertyFilter.name,
              propertyFilter.values[0]
            )
          );
        } else {
          // There are multiple alternative filters specified for the property
          // Example: name=Peter|William|Chris
          // Combine these via MatchAny conditions.
          propertyConditions.push(
            MatchAnyCondition(
              ...propertyFilter.values.map((value) =>
                MatchPropertyCondition(propertyFilter.name, value)
              )
            )
          );
        }
      }
    }

    return propertyConditions;
  }
}
