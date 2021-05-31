import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { QueryResult } from '../shared/queries';
import SimpleStore from './SimpleStore';
import FilterStore from './FilterStore';
import { FilterService } from '../services/filter';

@injectable()
export default class GraphDataStore extends SimpleStore<QueryResult> {
  @inject(FilterStore)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  private readonly filterStore: FilterStore = null!;

  @inject(FilterService)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  private readonly filterService: FilterService = null!;

  constructor() {
    super();
    // If the filter changes, the graph state will be updated automatically
    this.filterStore.getState().subscribe({
      next: (filter) => {
        this.filterService
          .query(filter)
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
