import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { firstValueFrom, from, of, ReplaySubject, Subject } from 'rxjs';
import { filter, map, mergeMap, startWith, tap } from 'rxjs/operators';
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
import KeyedCacheObservable from '../../utils/KeyedCacheObservable';
import withCancellation from '../../utils/withCancellation';
import SingleValueCachedObservable from '../../utils/SingleValueCachedObservable';

const MAX_BATCH_SIZE = 90;

// TODO #249: Re-add ignored functions in QueryServiceImpl.ts to coverage when used #249
/* istanbul ignore next */
function createBatches(array: number[] | NodeDescriptor[] | EdgeDescriptor[]) {
  const batches = [];
  for (let i = 0; i < array.length; i += MAX_BATCH_SIZE) {
    batches.push(array.slice(i, i + MAX_BATCH_SIZE));
  }
  return batches;
}

// TODO #249: Re-add ignored functions in QueryServiceImpl.ts to coverage when used #249
/* istanbul ignore next */
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
  entities: KeyedCacheObservable<T>;
};

// TODO #249: Re-add ignored functions in QueryServiceImpl.ts to coverage when used #249
/* istanbul ignore next */
function buildCache<T extends Edge | Node>(
  http: HttpService,
  type: 'Nodes' | 'Edges'
): BatchCache<T> {
  const batches = new ReplaySubject<number[]>();
  const entities = new KeyedCacheObservable<T>(
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
  private readonly numberOfEntities: SingleValueCachedObservable<CountQueryResult> =
    new SingleValueCachedObservable<CountQueryResult>(() =>
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

  // TODO #249: Re-add ignored functions in QueryServiceImpl.ts to coverage when used #249
  /* istanbul ignore next */
  public async getEdgesById(
    idsOrDescriptors: number[] | EdgeDescriptor[],
    cancellation?: CancellationToken
  ): Promise<Edge[]> {
    return this.getEntitiesById(this.edgesById, idsOrDescriptors, cancellation);
  }

  // TODO #249: Re-add ignored functions in QueryServiceImpl.ts to coverage when used #249
  /* istanbul ignore next */
  public async getNodesById(
    idsOrDescriptors: number[] | NodeDescriptor[],
    cancellation?: CancellationToken
  ): Promise<Node[]> {
    return this.getEntitiesById(this.nodesById, idsOrDescriptors, cancellation);
  }

  // TODO #249: Re-add ignored functions in QueryServiceImpl.ts to coverage when used #249
  /* istanbul ignore next */
  private getEntitiesById<T = Node | Edge>(
    entitiesById: BatchCache<T>,
    idsOrDescriptors: number[] | NodeDescriptor[],
    cancellation?: CancellationToken
  ): Promise<T[]> {
    const cache = entitiesById.entities.getState();

    // Ids as number.
    const ids = idsOrDescriptors.map(
      (idOrDescriptor: number | { id: number }) =>
        typeof idOrDescriptor === 'number' ? idOrDescriptor : idOrDescriptor.id
    );
    // Already cached values.
    // Stored here since they might get removed from the cache during the async operation.
    const foundValues = ids
      .filter((id) => cache.has(id))
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- nullcheck done in line before
      .map((id) => cache.get(id)!);
    // Values not in cache.
    let missingIds: number[] = ids.filter((id) => !cache.has(id));

    // https://github.com/amosproj/amos-ss2021-project2-context-map/issues/170
    const batches = createBatches(missingIds);
    for (const batch of batches) {
      // Initializes requests.
      entitiesById.batches.next(batch);
    }

    return withCancellation(
      firstValueFrom(
        entitiesById.entities.get().pipe(
          // Called on each new state of the cache.
          // Puts the found values in `foundValues` and removes them from `missingIds`.
          tap((newCache) => {
            missingIds = missingIds.reduce((stillMissing, id) => {
              if (newCache.has(id)) {
                // If missing item was found => put them in `foundValues`
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                foundValues.push(newCache.get(id)!);
              } else {
                // If missing item is not found => mark them as still missing.
                stillMissing.push(id);
              }
              return stillMissing;
            }, [] as number[]);
          }),
          // Only continue if all missing values are found
          filter(() => missingIds.length === 0),
          // Return the found values.
          map(() => foundValues)
        )
      ),
      cancellation
    );
  }

  getNumberOfEntities(
    cancellation?: CancellationToken
  ): Promise<CountQueryResult> {
    return withCancellation(
      firstValueFrom(this.numberOfEntities.get()),
      cancellation
    );
  }
}
