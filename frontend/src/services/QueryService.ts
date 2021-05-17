import { injectable } from 'inversify';
import 'reflect-metadata';
import { LimitQuery } from '../shared/queries/LimitQuery';
import { QueryResult } from '../shared/queries/QueryResult';
import { SearchResult } from '../shared/search/SearchResult';
import { CancellationToken } from '../utils/CancellationToken';

/**
 * A service that can be used to perform graph queries.
 */
@injectable()
export default abstract class QueryService {
  /**
   * Performs a query for all nodes and edges available within the specified limits.
   * @param query A query that contains limits on the max number of node and edge to deliver.
   * @param cancellation A CancellationToken used to cancel the asynchronous operation.
   * @returns A promise that represents the asynchronous operations. When evaluated, the promise result contains the query result of nodes and edges.
   */
  public abstract queryAll(
    query?: LimitQuery,
    cancellation?: CancellationToken
  ): Promise<QueryResult>;

  /**
   * Searches through all entities and entity types and returns those, that
   * match the searchString. It only returns those value with the prefix of
   * searchStrings.
   * Values with n spaces are considered as n+1 single values.
   */
  public abstract fullTextSearch(
    searchString: string,
    cancellation?: CancellationToken
  ): Promise<SearchResult>;
}
