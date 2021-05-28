import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { EdgeType } from '../../shared/schema/EdgeType';
import { NodeType } from '../../shared/schema/NodeType';
import { AsyncLazy } from '../../shared/utils';
import { CancellationToken } from '../../utils/CancellationToken';
import withCancellation from '../../utils/withCancellation';
import HttpService from '../http';
import SchemaService from './SchemaService';

/**
 * The implementation of schema service that performs requests
 * via the backend.
 */
@injectable()
export default class SchemaServiceImpl extends SchemaService {
  @inject(HttpService)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  private readonly http: HttpService = null!;
  private readonly edgeTypesLazy: AsyncLazy<EdgeType[]>;
  private readonly nodeTypesLazy: AsyncLazy<NodeType[]>;

  public constructor() {
    super();

    this.edgeTypesLazy = new AsyncLazy<EdgeType[]>(
      this.requestEdgeTypes.bind(this),
      { retryOnError: true }
    );

    this.nodeTypesLazy = new AsyncLazy<NodeType[]>(
      this.requestNodeTypes.bind(this),
      { retryOnError: true }
    );
  }

  private requestEdgeTypes(): Promise<EdgeType[]> {
    return this.http.get<EdgeType[]>('/api/schema/edge-types');
  }

  private requestNodeTypes(): Promise<NodeType[]> {
    return this.http.get<NodeType[]>('/api/schema/node-types');
  }

  public getEdgeTypes(cancellation?: CancellationToken): Promise<EdgeType[]> {
    return withCancellation(this.edgeTypesLazy.value, cancellation);
  }

  public getNodeTypes(cancellation?: CancellationToken): Promise<NodeType[]> {
    return withCancellation(this.nodeTypesLazy.value, cancellation);
  }
}
