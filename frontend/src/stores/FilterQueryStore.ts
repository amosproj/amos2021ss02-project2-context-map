import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Observable, Subscription } from 'rxjs';
import {
  CountQueryResult,
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
import { QueryService } from '../services/query';
import withLoadingBar from '../utils/withLoadingBar';
import withErrorHandler from '../utils/withErrorHandler';
import ErrorStore from './ErrorStore';
import LoadingStore from './LoadingStore';
import EntityQueryLimitStore from './EntityQueryLimitStore';

/**
 * Contains the current state of the filterQuery.
 */
@injectable()
export default class FilterQueryStore extends SimpleStore<FilterQuery> {
  private queryServiceSubscription?: Subscription;

  private entityQueryLimitStoreSubscription?: Subscription;

  private max: CountQueryResult = { nodes: 150, edges: 150 };

  @inject(QueryService)
  private readonly queryService!: QueryService;

  @inject(EntityQueryLimitStore)
  private readonly entityQueryLimitStore!: EntityQueryLimitStore;

  @inject(FilterStateStore)
  private readonly filterStateStore!: FilterStateStore;

  @inject(ErrorStore)
  private readonly errorStore!: ErrorStore;

  @inject(LoadingStore)
  private readonly loadingStore!: LoadingStore;

  /**
   * @override
   */
  protected ensureInit(): void {
    if (this.queryServiceSubscription == null) {
      this.queryServiceSubscription = this.executeQuery().subscribe({
        next: (max) => {
          this.setLimits(max, this.entityQueryLimitStore.getValue());
          this.max = max;
        },
        error: () => {
          this.setLimits(
            { nodes: -1, edges: -1 },
            this.entityQueryLimitStore.getValue()
          );
        },
      });
    }

    if (this.entityQueryLimitStoreSubscription == null) {
      this.entityQueryLimitStoreSubscription =
        this.subscribeToEntityQueryLimitStore();
    }
  }

  protected getInitialValue(): FilterQuery {
    return {
      limits: { nodes: 150, edges: 150 },
      includeSubsidiary: true,
    };
  }

  /**
   * Updates the state of the filterQuery by synchronizing it with the {@link FilterStateStore}.
   */
  public update(): void {
    const filter = this.filterStateStore.getValue();
    const filterQuery = this.convertToFilterQuery(filter);
    this.mergeState(filterQuery);
  }

  private getLimits(
    max: CountQueryResult,
    val: CountQueryResult
  ): CountQueryResult {
    return {
      nodes: val.nodes >= max.nodes ? max.nodes : val.nodes,
      edges: val.nodes >= max.edges ? max.edges : val.edges,
    };
  }

  private setLimits(max: CountQueryResult, val: CountQueryResult): void {
    const curValue = this.storeSubject.value;
    curValue.limits = this.getLimits(max, val);

    this.storeSubject.next(curValue);
  }

  private executeQuery(): Observable<CountQueryResult> {
    return this.queryService
      .getNumberOfEntities()
      .pipe(
        withLoadingBar({ loadingStore: this.loadingStore }),
        withErrorHandler({ errorStore: this.errorStore })
      );
  }

  private subscribeToEntityQueryLimitStore(): Subscription {
    return this.entityQueryLimitStore.getState().subscribe({
      next: (countQueryResult) => {
        this.setLimits(this.max, countQueryResult);
        const filter = this.filterStateStore.getValue();
        const filterQuery = this.convertToFilterQuery(filter);
        this.storeSubject.next({ ...this.storeSubject.value, ...filterQuery });
      },
    });
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
