import { injectable } from 'inversify';
import 'reflect-metadata';
import { from } from 'rxjs';
import { QueryResult } from '../shared/queries';
import SimpleStore from './SimpleStore';
import FilterStore from './FilterStore';
import { FilterService } from '../services/filter';
import { CancellationTokenSource } from '../utils/CancellationToken';
import withErrorHandler from '../utils/withErrorHandler';
import ErrorStore from './ErrorStore';
import LoadingStore from './LoadingStore';
import withLoadingBar from '../utils/withLoadingBar';

@injectable()
export default class GraphDataStore extends SimpleStore<QueryResult> {
  private filterQueryCancelToken?: CancellationTokenSource;
  constructor(
    private readonly filterStore: FilterStore,
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
