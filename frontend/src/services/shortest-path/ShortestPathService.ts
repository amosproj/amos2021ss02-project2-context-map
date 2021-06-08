/* istanbul ignore file */

import { injectable } from 'inversify';
import 'reflect-metadata';
import { QueryResult, ShortestPathQuery } from '../../shared/queries';
import { CancellationToken } from '../../utils/CancellationToken';

@injectable()
export default abstract class ShortestPathService {
  public abstract query(
    query?: ShortestPathQuery,
    cancellation?: CancellationToken
  ): Promise<QueryResult>;
}
