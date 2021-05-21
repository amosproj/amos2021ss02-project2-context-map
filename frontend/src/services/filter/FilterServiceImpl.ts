import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { EdgeTypeFilterModel, NodeTypeFilterModel } from '../../shared/filter';
import { CancellationToken } from '../../utils/CancellationToken';
import HttpService, { HttpGetRequest } from '../http';
import FilterService from './FilterService';

function buildRequest(type: string): HttpGetRequest {
  return new HttpGetRequest({}, { type });
}

@injectable()
export default class FilterServiceImpl implements FilterService {
  @inject(HttpService)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  private readonly http: HttpService = null!;

  public getNodeTypeFilterModel(
    type: string,
    cancellation?: CancellationToken
  ): Promise<NodeTypeFilterModel> {
    return this.http.get<NodeTypeFilterModel>(
      '/api/filter/node-type',
      buildRequest(type),
      cancellation
    );
  }

  public getEdgeTypeFilterModel(
    type: string,
    cancellation?: CancellationToken
  ): Promise<EdgeTypeFilterModel> {
    return this.http.get<NodeTypeFilterModel>(
      '/api/filter/edge-type',
      buildRequest(type),
      cancellation
    );
  }
}
