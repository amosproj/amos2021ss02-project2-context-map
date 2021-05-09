import { injectable } from 'inversify';
import 'reflect-metadata';
import { LimitQuery } from '../entities/queries/LimitQuery';
import { QueryResult } from '../entities/queries/QueryResult';
import { CancellationToken } from '../utils/CancellationToken';

@injectable()
export default abstract class QueryService {
  public abstract queryAll(
    query?: LimitQuery,
    cancellation?: CancellationToken
  ): Promise<QueryResult>;
}
