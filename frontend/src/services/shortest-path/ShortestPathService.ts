/* istanbul ignore file */

import { injectable } from 'inversify';
import 'reflect-metadata';
import { QueryResult, ShortestPathQuery } from '../../shared/queries';
import { CancellationToken } from '../../utils/CancellationToken';

/**
 * A query service that can be used to execute shortest-path queries.
 */
@injectable()
export default abstract class ShortestPathService {
  /**
   * Executes a shortest-path query.
   * @param query The shortest-path query to execute.
   * @param cancellation A cancellation-token used to cancel the asynchronous operation.
   * @returns The result of the query-operation.
   */
  public abstract query(
    query?: ShortestPathQuery,
    cancellation?: CancellationToken
  ): Promise<QueryResult>;
}
