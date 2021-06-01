import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { from, Observable, Subscription } from 'rxjs';
import { QueryResult } from '../shared/queries';
import SimpleStore from './SimpleStore';
import FilterQueryStore from './FilterQueryStore';
import { FilterService } from '../services/filter';
import { CancellationTokenSource } from '../utils/CancellationToken';
import withErrorHandler from '../utils/withErrorHandler';
import ErrorStore from './ErrorStore';
import LoadingStore from './LoadingStore';
import withLoadingBar from '../utils/withLoadingBar';

/**
 * Contains the current state of the fetched query.
 * Updates it's state automatically if the state of {@link FilterQueryStore} changes.
 */
@injectable()
export default class QueryResultStore extends SimpleStore<QueryResult> {
  /**
   * Active cancel token for the filter query.
   * @private
   */
  private filterQueryCancelToken?: CancellationTokenSource;
  private filterQueryStoreSubscription?: Subscription;

  @inject(FilterQueryStore)
  private readonly filterQueryStore!: FilterQueryStore;

  @inject(FilterService)
  private readonly filterService!: FilterService;

  @inject(ErrorStore)
  private readonly errorStore!: ErrorStore;

  @inject(LoadingStore)
  private readonly loadingStore!: LoadingStore;

  protected getInitialValue(): QueryResult {
    return { nodes: [], edges: [] };
  }

  getState(): Observable<QueryResult> {
    if (this.filterQueryStoreSubscription == null) {
      // If it's called the first time => subscribe to the filterQueryStore
      this.filterQueryStoreSubscription = this.subscribeToFilterQueryStore();
    }
    return super.getState();
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
      next: (filter) => {
        this.filterQueryCancelToken?.cancel();
        this.filterQueryCancelToken = new CancellationTokenSource();
        from(
          this.filterService.query(filter, this.filterQueryCancelToken.token)
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
      },
    });
  }
}
