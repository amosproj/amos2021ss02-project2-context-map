/* istanbul ignore file */

import { injectable } from 'inversify';
import 'reflect-metadata';
import { Observable } from 'rxjs';
import { QueryResult, ShortestPathQuery } from '../../shared/queries';

/**
 * A query service that can be used to execute shortest-path queries.
 */
@injectable()
export default abstract class ShortestPathService {
  /**
   * Executes a shortest-path query.
   * @param query The shortest-path query to execute.
   * @returns The result of the query-operation.
   */
  public abstract query(query?: ShortestPathQuery): Observable<QueryResult>;
}
