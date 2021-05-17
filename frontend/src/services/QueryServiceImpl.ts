import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Edge } from '../shared/entities/Edge';
import { EdgeDescriptor } from '../shared/entities/EdgeDescriptor';
import { Node } from '../shared/entities/Node';
import { NodeDescriptor } from '../shared/entities/NodeDescriptor';
import { LimitQuery } from '../shared/queries/LimitQuery';
import { QueryResult } from '../shared/queries/QueryResult';
import { CancellationToken } from '../utils/CancellationToken';
import HttpService, { HttpGetRequest } from './http';
import QueryService from './QueryService';

function buildDetailsRequest(
  idsOrDescriptors: number[] | { id: number }[]
): HttpGetRequest {
  const ids = idsOrDescriptors.map((idOrDescriptor: number | { id: number }) =>
    typeof idOrDescriptor === 'number' ? idOrDescriptor : idOrDescriptor.id
  );

  const request = new HttpGetRequest({}, { ids });
  return request;
}

/**
 * The implementation of query service that performs query requests
 * via the backend.
 */
@injectable()
export default class QueryServiceImpl extends QueryService {
  @inject(HttpService)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  private readonly http: HttpService = null!;

  public queryAll(
    query?: LimitQuery,
    cancellation?: CancellationToken
  ): Promise<QueryResult> {
    const url = `/queryAll`;

    return this.http.post<QueryResult>(url, query, cancellation);
  }

  // TODO: Cache entity details: https://github.com/amosproj/amos-ss2021-project2-context-map/issues/62

  public getEdgesById(
    idsOrDescriptors: number[] | EdgeDescriptor[],
    cancellation?: CancellationToken
  ): Promise<Edge[]> {
    return this.http.get<Edge[]>(
      '/getEdgesById',
      buildDetailsRequest(idsOrDescriptors),
      cancellation
    );
  }

  public getNodesById(
    idsOrDescriptors: number[] | NodeDescriptor[],
    cancellation?: CancellationToken
  ): Promise<Node[]> {
    return this.http.get<Node[]>(
      '/getNodesById',
      buildDetailsRequest(idsOrDescriptors),
      cancellation
    );
  }
}
