import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { CountQueryResult, QueryBase, QueryResult } from '../../shared/queries';
import {
  Edge,
  EdgeDescriptor,
  Node,
  NodeDescriptor,
} from '../../shared/entities';
import { CancellationToken } from '../../utils/CancellationToken';
import HttpService, { HttpGetRequest } from '../http';
import QueryService from './QueryService';
import CachedObservable from '../../utils/CachedObservable';

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

  return new HttpGetRequest({}, { ids });
}

/**
 * The implementation of query service that performs query requests
 * via the backend.
 */
@injectable()
export default class QueryServiceImpl extends QueryService {
  private readonly numberOfEntities: CachedObservable<CountQueryResult> =
    new CachedObservable(() =>
      this.http.get<CountQueryResult>('/api/getNumberOfEntities')
    );

  public constructor(
    @inject(HttpService)
    private readonly http: HttpService
  ) {
    super();
  }

  /* istanbul ignore next */
  public queryAll(
    query?: QueryBase,
    cancellation?: CancellationToken
  ): Promise<QueryResult> {
    const url = `/api/queryAll`;

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
            '/api/getEdgesById',
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
            '/api/getNodesById',
            buildDetailsRequest(batch),
            cancellation
          )
        )
      )
    ).flat();
  }

  getNumberOfEntities(
    cancellation?: CancellationToken
  ): Promise<CountQueryResult> {
    return this.numberOfEntities.asPromise(cancellation);
  }
}
