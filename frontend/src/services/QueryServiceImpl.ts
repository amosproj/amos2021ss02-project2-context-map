import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { QueryBase, QueryResult } from '../shared/queries';
import { Edge } from '../shared/entities/Edge';
import { EdgeDescriptor } from '../shared/entities/EdgeDescriptor';
import { Node } from '../shared/entities/Node';
import { NodeDescriptor } from '../shared/entities/NodeDescriptor';
import { CancellationToken } from '../utils/CancellationToken';
import HttpService, { HttpGetRequest } from './http';
import QueryService from './QueryService';

const MAX_BATCH_SIZE = 90;

function createBatches(array: number[] | NodeDescriptor[]) {
  const batches = [];
  for (let i = 0; i < array.length; i += MAX_BATCH_SIZE) {
    batches.push(array.slice(i, i + MAX_BATCH_SIZE));
  }
  return batches;
}

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
    query?: QueryBase,
    cancellation?: CancellationToken
  ): Promise<QueryResult> {
    const url = `/queryAll`;

    return this.http.post<QueryResult>(url, query, cancellation);
  }

  // TODO: Cache entity details: https://github.com/amosproj/amos-ss2021-project2-context-map/issues/62

  public async getEdgesById(
    idsOrDescriptors: number[] | EdgeDescriptor[],
    cancellation?: CancellationToken
  ): Promise<Edge[]> {
    const batches = createBatches(idsOrDescriptors);

    return (
      await Promise.all(
        batches.map((batch) =>
          this.http.get<Edge[]>(
            '/getEdgesById',
            buildDetailsRequest(batch),
            cancellation
          )
        )
      )
    ).flat();
  }

  public async getNodesById(
    idsOrDescriptors: number[] | NodeDescriptor[],
    cancellation?: CancellationToken
  ): Promise<Node[]> {
    const batches = createBatches(idsOrDescriptors);

    return (
      await Promise.all(
        batches.map((batch) =>
          this.http.get<Node[]>(
            '/getNodesById',
            buildDetailsRequest(batch),
            cancellation
          )
        )
      )
    ).flat();
  }
}
