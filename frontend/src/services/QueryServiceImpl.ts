import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { LimitQuery } from '../shared/queries/LimitQuery';
import { QueryResult } from '../shared/queries/QueryResult';
import { SearchResult } from '../shared/search/SearchResult';
import { CancellationToken } from '../utils/CancellationToken';
import HttpService from './http';
import QueryService from './QueryService';

/**
 * The implementation of query service that performs query requests
 * via the backend.
 */
@injectable()
export default class QueryServiceImpl extends QueryService {
  @inject(HttpService)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  private readonly http: HttpService = null!;

  public queryAll(
    query?: LimitQuery,
    cancellation?: CancellationToken
  ): Promise<QueryResult> {
    const url = `/queryAll`;

    return this.http.post<QueryResult>(url, query, cancellation);
  }

  public fullTextSearch(
    searchString: string,
    path: string,
    cancellation?: CancellationToken
  ): Promise<SearchResult> {
    const possiblePaths = ['all', 'nodes', 'edges'];
    if (!possiblePaths.includes(path)) {
      // TODO return an error here instead?
      return Promise.resolve({
        nodes: [],
        edges: [],
        nodeTypes: [],
        edgeTypes: [],
      });
    }
    const url = `/search/all?filter=${searchString}`;

    return this.http.get<SearchResult>(url, cancellation);
  }
}
