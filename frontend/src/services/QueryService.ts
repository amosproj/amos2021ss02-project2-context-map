import { injectable } from 'inversify';
import 'reflect-metadata';
import { LimitQuery } from '../shared/queries/LimitQuery';
import { QueryResult } from '../shared/queries/QueryResult';
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
}
