import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { LimitQuery } from '../shared/queries/LimitQuery';
import { QueryResult } from '../shared/queries/QueryResult';
import { CancellationToken } from '../utils/CancellationToken';
import HTTPHelper from './HTTPHelper';
import QueryService from './QueryService';

/**
 * The implementation of query service that performs query requests
 * via the backend.
 */
@injectable()
export default class QueryServiceImpl extends QueryService {
  @inject(HTTPHelper)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  private readonly http: HTTPHelper = null!;

  public queryAll(
    query?: LimitQuery,
    cancellation?: CancellationToken
  ): Promise<QueryResult> {
    const url = `/queryAll`;

    return this.http.post<QueryResult>(url, query, cancellation);
  }
}
