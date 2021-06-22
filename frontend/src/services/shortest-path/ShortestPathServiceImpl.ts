import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { Observable } from 'rxjs';
import { QueryResult, ShortestPathQuery } from '../../shared/queries';
import HttpService from '../http';
import ShortestPathService from './ShortestPathService';

@injectable()
export default class ShortestPathServiceImpl implements ShortestPathService {
  @inject(HttpService)
  private readonly http!: HttpService;

  public query(query?: ShortestPathQuery): Observable<QueryResult> {
    return this.http.post<QueryResult>('/api/shortest-path/query', query);
  }
}
