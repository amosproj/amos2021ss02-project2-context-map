import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { firstValueFrom, from, of, ReplaySubject, Subject } from 'rxjs';
import { filter, map, mergeMap, startWith } from 'rxjs/operators';
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
import CachedMergeObservable from '../../utils/CachedMergeObservable';
import withCancellation from '../../utils/withCancellation';
import SimpleCachedObservable from '../../utils/SimpleCachedObservable';

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

type BatchCache<T> = {
  batches: Subject<number[]>;
  entities: CachedMergeObservable<T>;
};

function buildCache<T extends Edge | Node>(
  http: HttpService,
  type: 'Nodes' | 'Edges'
): BatchCache<T> {
  const batches = new ReplaySubject<number[]>();
  const entities = new CachedMergeObservable<T>(
    (node) => node.id,
    batches.pipe(
      startWith([]),
      mergeMap((batch) => {
        if (batch.length === 0) return of([]);
        return from(
          http.get<T[]>(`/api/get${type}ById`, buildDetailsRequest(batch))
        );
      })
    )
  );

  return { batches, entities };
}

/**
 * The implementation of query service that performs query requests
 * via the backend.
 */
@injectable()
export default class QueryServiceImpl extends QueryService {
  private readonly numberOfEntities: SimpleCachedObservable<CountQueryResult> =
    new SimpleCachedObservable(() =>
      this.http.get<CountQueryResult>('/api/getNumberOfEntities')
    );

  private readonly edgesById = buildCache<Edge>(this.http, 'Edges');
  private readonly nodesById = buildCache<Node>(this.http, 'Nodes');

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
    const cachedIds = this.edgesById.entities.getState();
    const ids = idsOrDescriptors
      .map((idOrDescriptor: number | { id: number }) =>
        typeof idOrDescriptor === 'number' ? idOrDescriptor : idOrDescriptor.id
      )
      .filter((id) => cachedIds[id] === undefined);

    const batches = createBatches(ids) as number[][];
    for (const batch of batches) {
      this.edgesById.batches.next(batch);
    }

    return withCancellation(
      firstValueFrom(
        this.edgesById.entities.pipe().pipe(
          filter((cache) => ids.every((id) => cache[id] != null)),
          map((x) => Object.values(x))
        )
      ),
      cancellation
    );
  }

  public async getNodesById(
    idsOrDescriptors: number[] | NodeDescriptor[],
    cancellation?: CancellationToken
  ): Promise<Node[]> {
    const cachedIds = this.nodesById.entities.getState();
    const ids = idsOrDescriptors
      .map((idOrDescriptor: number | { id: number }) =>
        typeof idOrDescriptor === 'number' ? idOrDescriptor : idOrDescriptor.id
      )
      .filter((id) => cachedIds[id] === undefined);

    const batches = createBatches(ids) as number[][];
    for (const batch of batches) {
      this.nodesById.batches.next(batch);
    }

    return withCancellation(
      firstValueFrom(
        this.nodesById.entities.pipe().pipe(
          filter((cache) => ids.every((id) => cache[id] != null)),
          map((x) => Object.values(x))
          // timeout(5000)
        )
      ),
      cancellation
    );
  }

  getNumberOfEntities(
    cancellation?: CancellationToken
  ): Promise<CountQueryResult> {
    return this.numberOfEntities.asPromise(cancellation);
  }
}
