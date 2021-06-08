import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { firstValueFrom } from 'rxjs';
import { EdgeTypeFilterModel, NodeTypeFilterModel } from '../../shared/filter';
import { FilterQuery, QueryResult } from '../../shared/queries';
import { CancellationToken } from '../../utils/CancellationToken';
import HttpService, { HttpGetRequest } from '../http';
import FilterService from './FilterService';
import SingleValueCachedObservable from '../../utils/SingleValueCachedObservable';
import withCancellation from '../../utils/withCancellation';

function buildRequest(type: string): HttpGetRequest {
  return new HttpGetRequest({}, { type });
}

@injectable()
export default class FilterServiceImpl implements FilterService {
  /**
   * Node and Edge cache of form <type, cache>.
   * @private
   */
  private readonly cache = {
    edges: new Map<string, SingleValueCachedObservable<EdgeTypeFilterModel>>(),
    nodes: new Map<string, SingleValueCachedObservable<NodeTypeFilterModel>>(),
  };

  constructor(
    @inject(HttpService)
    private readonly http: HttpService
  ) {}

  public query(
    query?: FilterQuery,
    cancellation?: CancellationToken
  ): Promise<QueryResult> {
    return this.http.post<QueryResult>(
      '/api/filter/query',
      query,
      cancellation
    );
  }

  public getNodeTypeFilterModel(
    type: string,
    cancellation?: CancellationToken
  ): Promise<NodeTypeFilterModel> {
    let cachedValue = this.cache.nodes.get(type);

    if (cachedValue == null) {
      cachedValue = new SingleValueCachedObservable(() =>
        this.http.get<NodeTypeFilterModel>(
          '/api/filter/node-type',
          buildRequest(type)
        )
      );
      this.cache.nodes.set(type, cachedValue);
    }

    return withCancellation(firstValueFrom(cachedValue.get()), cancellation);
  }

  public getEdgeTypeFilterModel(
    type: string,
    cancellation?: CancellationToken
  ): Promise<EdgeTypeFilterModel> {
    let cachedValue = this.cache.edges.get(type);

    if (cachedValue == null) {
      cachedValue = new SingleValueCachedObservable(() =>
        this.http.get<EdgeTypeFilterModel>(
          '/api/filter/edge-type',
          buildRequest(type)
        )
      );
      this.cache.edges.set(type, cachedValue);
    }

    return withCancellation(firstValueFrom(cachedValue.get()), cancellation);
  }
}
