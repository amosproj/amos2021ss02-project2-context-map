import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import {
  EdgeType,
  NodeType,
  NodeTypeConnectionInfo,
} from '../../shared/schema';
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
  private readonly nodeTypeConnectionInfoLazy: AsyncLazy<
    NodeTypeConnectionInfo[]
  >;

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

    this.nodeTypeConnectionInfoLazy = new AsyncLazy<NodeTypeConnectionInfo[]>(
      this.requestNodeTypeConnectionInfo.bind(this),
      { retryOnError: true }
    );
  }

  private requestEdgeTypes(): Promise<EdgeType[]> {
    return this.http.get<EdgeType[]>('/api/schema/edge-types');
  }

  private requestNodeTypes(): Promise<NodeType[]> {
    return this.http.get<NodeType[]>('/api/schema/node-types');
  }

  private requestNodeTypeConnectionInfo(): Promise<NodeTypeConnectionInfo[]> {
    return this.http.get<NodeTypeConnectionInfo[]>(
      '/api/schema/node-type-connection-info'
    );
  }

  public getEdgeTypes(cancellation?: CancellationToken): Promise<EdgeType[]> {
    return withCancellation(this.edgeTypesLazy.value, cancellation);
  }

  public getNodeTypes(cancellation?: CancellationToken): Promise<NodeType[]> {
    return withCancellation(this.nodeTypesLazy.value, cancellation);
  }

  public getNodeTypeConnectionInfo(
    cancellation?: CancellationToken
  ): Promise<NodeTypeConnectionInfo[]> {
    return withCancellation(
      this.nodeTypeConnectionInfoLazy.value,
      cancellation
    );
  }
}
