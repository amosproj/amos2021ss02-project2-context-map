import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { QueryResult, ShortestPathQuery } from '../../shared/queries';
import { CancellationToken } from '../../utils/CancellationToken';
import HttpService from '../http';
import ShortestPathService from './ShortestPathService';

@injectable()
export default class ShortestPathServiceImpl implements ShortestPathService {
  constructor(
    @inject(HttpService)
    private readonly http: HttpService
  ) {}

  public query(
    query?: ShortestPathQuery,
    cancellation?: CancellationToken
  ): Promise<QueryResult> {
    return this.http.post<QueryResult>(
      '/api/shortest-path/query',
      query,
      cancellation
    );
  }
}
