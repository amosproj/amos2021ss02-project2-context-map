import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { defer, Observable } from 'rxjs';
import {
  EdgeType,
  NodeType,
  NodeTypeConnectionInfo,
} from '../../shared/schema';
import HttpService from '../http';
import SchemaService from './SchemaService';
import SingleValueCachedObservable from '../../utils/SingleValueCachedObservable';
import { QueryResult } from '../../shared/queries';

/**
 * The implementation of schema service that performs requests
 * via the backend.
 */
@injectable()
export default class SchemaServiceImpl extends SchemaService {
  @inject(HttpService)
  private readonly http!: HttpService;

  private readonly edgeTypesCache = new SingleValueCachedObservable<EdgeType[]>(
    defer(() => this.http.get<EdgeType[]>('/api/schema/edge-types'))
  );
  private readonly nodeTypesCache = new SingleValueCachedObservable<NodeType[]>(
    defer(() => this.http.get<NodeType[]>('/api/schema/node-types'))
  );
  private readonly nodeTypeConnectionInfoCache =
    new SingleValueCachedObservable<NodeTypeConnectionInfo[]>(
      defer(() =>
        this.http.get<NodeTypeConnectionInfo[]>(
          '/api/schema/node-type-connection-info'
        )
      )
    );
  private readonly metaGraph = new SingleValueCachedObservable<QueryResult>(
    defer(() => this.http.get<QueryResult>('/api/schema/meta-graph'))
  );

  public constructor() {
    super();
  }

  public getEdgeTypes(): Observable<EdgeType[]> {
    return this.edgeTypesCache.get();
  }

  public getNodeTypes(): Observable<NodeType[]> {
    return this.nodeTypesCache.get();
  }

  public getNodeTypeConnectionInfo(): Observable<NodeTypeConnectionInfo[]> {
    return this.nodeTypeConnectionInfoCache.get();
  }

  public getMetaGraph(): Observable<QueryResult> {
    return this.metaGraph.get();
  }
}
