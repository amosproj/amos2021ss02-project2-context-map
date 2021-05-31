import { injectable } from 'inversify';
import 'reflect-metadata';
import { QueryResult } from '../shared/queries';
import SimpleStore from './SimpleStore';
import FilterStore from './FilterStore';
import { FilterService } from '../services/filter';
import { CancellationTokenSource } from '../utils/CancellationToken';

@injectable()
export default class GraphDataStore extends SimpleStore<QueryResult> {
  private filterQueryCancelToken?: CancellationTokenSource;

  constructor(
    private readonly filterStore: FilterStore,
    private readonly filterService: FilterService
  ) {
    super();
    // If the filter changes, the graph state will be updated automatically
    this.filterStore.getState().subscribe({
      next: (filter) => {
        this.filterQueryCancelToken?.cancel();
        this.filterQueryCancelToken = new CancellationTokenSource();
        this.filterService
          .query(filter, this.filterQueryCancelToken.token)
          .then((res) => this.setState(res))
          // eslint-disable-next-line no-console -- TODO proper error handling
          .catch((err) => console.error(err));
      },
    });
  }

  protected getInitialValue(): QueryResult {
    return { nodes: [], edges: [] };
  }
}
