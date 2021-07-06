import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { FilterQuery, QueryResult, ShortestPathQuery } from '../shared/queries';
import SimpleStore from './SimpleStore';
import FilterQueryStore from './FilterQueryStore';
import { FilterService } from '../services/filter';
import withErrorHandler from '../utils/withErrorHandler';
import ErrorStore from './ErrorStore';
import LoadingStore from './LoadingStore';
import withLoadingBar from '../utils/withLoadingBar';
import { ShortestPathStateStore } from './shortest-path/ShortestPathStateStore';
import ShortestPathService from '../services/shortest-path/ShortestPathService';
import { ShortestPathState } from './shortest-path/ShortestPathState';

/**
 * Provides meta information about the query result
 */
export type QueryResultMeta = {
  /**
   * If undefined: no shortest path queried.
   * If false: shortest path queried but is not in result
   * If true: shortest path queried and is in result.
   */
  containsShortestPath?: boolean;
};

/**
 * Contains the current state of the fetched query.
 * Updates it's state automatically if the state of {@link FilterQueryStore} changes.
 */
@injectable()
export default class QueryResultStore extends SimpleStore<
  QueryResult & QueryResultMeta
> {
  /**
   * Active cancel token for the filter query.
   * @private
   */
  private filterQueryStoreSubscription?: Subscription;
  private shortestPathStateStoreSubscription?: Subscription;

  @inject(FilterQueryStore)
  private readonly filterQueryStore!: FilterQueryStore;

  @inject(ShortestPathStateStore)
  private readonly shortestPathStateStore!: ShortestPathStateStore;

  @inject(FilterService)
  private readonly filterService!: FilterService;

  @inject(ShortestPathService)
  private readonly shortestPathService!: ShortestPathService;

  @inject(ErrorStore)
  private readonly errorStore!: ErrorStore;

  @inject(LoadingStore)
  private readonly loadingStore!: LoadingStore;

  protected getInitialValue(): QueryResult & QueryResultMeta {
    return { nodes: [], edges: [] };
  }

  protected ensureInit(): void {
    if (this.filterQueryStoreSubscription == null) {
      this.filterQueryStoreSubscription = this.subscribeToFilterQueryStore();
    }

    if (this.shortestPathStateStoreSubscription == null) {
      this.shortestPathStateStoreSubscription =
        this.subscribeToShortestPathStateStore();
    }
  }

  private executeQuery(
    filter: FilterQuery,
    shortestPath: ShortestPathState
  ): Observable<QueryResult & QueryResultMeta> {
    if (shortestPath.startNode !== null && shortestPath.endNode !== null) {
      const shortestPathQuery: ShortestPathQuery = {
        ...filter,
        startNode: shortestPath.startNode,
        endNode: shortestPath.endNode,
        ignoreEdgeDirections: shortestPath.ignoreEdgeDirections,
      };

      return this.shortestPathService.query(shortestPathQuery).pipe(
        map((result) => {
          const containsShortestPath =
            result.edges.some((e) => e.isPath) ||
            result.nodes.some((n) => n.isPath);
          return { ...result, containsShortestPath };
        })
      );
    }

    return this.filterService.query(filter);
  }

  private update(
    filter: FilterQuery | null,
    shortestPath: ShortestPathState | null
  ) {
    this.executeQuery(
      filter ?? this.filterQueryStore.getValue(),
      shortestPath ?? this.shortestPathStateStore.getValue()
    )
      .pipe(
        withLoadingBar({ loadingStore: this.loadingStore }),
        withErrorHandler({ rethrow: true, errorStore: this.errorStore })
      )
      .subscribe({
        next: (res) => {
          if (res) {
            this.setState(res);
          }
        },
        error: () => {
          // This error is already caught by withErrorHandler.
          // Now the state has to be reset so no old graph is provided if an error happens.
          this.setState(this.getInitialValue());
        },
      });
  }

  /**
   * Subscribes to the state of the {@link filterQueryStore} so that the state
   * of this store is updated when the {@link filterQueryStore} updates.
   * @returns subscription of the {@link filterQueryStore} state
   * @private
   */
  private subscribeToFilterQueryStore(): Subscription {
    // If the filter changes, the graph state will be updated automatically
    return this.filterQueryStore.getState().subscribe({
      next: (filter) => this.update(filter, null),
    });
  }

  private subscribeToShortestPathStateStore(): Subscription {
    return this.shortestPathStateStore.getState().subscribe({
      next: (shortestPath) => this.update(null, shortestPath),
    });
  }
}
