import { injectable } from 'inversify';
import 'reflect-metadata';
import { from } from 'rxjs';
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
  private filterQueryCancelToken?: CancellationTokenSource;
  constructor(
    private readonly filterStore: FilterQueryStore,
    private readonly filterService: FilterService,
    private readonly errorStore: ErrorStore,
    private readonly loadingStore: LoadingStore
  ) {
    super();
    // If the filter changes, the graph state will be updated automatically
    this.filterStore.getState().subscribe({
      next: (filter) => {
        this.filterQueryCancelToken?.cancel();
        this.filterQueryCancelToken = new CancellationTokenSource();
        from(
          this.filterService.query(filter, this.filterQueryCancelToken.token)
        )
          .pipe(
            withLoadingBar({ loadingStore }),
            withErrorHandler({ rethrow: true, errorStore })
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

  protected getInitialValue(): QueryResult {
    return { nodes: [], edges: [] };
  }
}
