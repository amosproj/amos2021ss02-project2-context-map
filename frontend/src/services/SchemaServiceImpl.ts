import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { CancellationToken } from '../utils/CancellationToken';
import HttpService from './http';
import SchemaService from './SchemaService';
import { EdgeType } from '../shared/schema/EdgeType';
import { NodeType } from '../shared/schema/NodeType';

/**
 * The implementation of schema service
 * via the backend.
 */
@injectable()
export default class SchemaServiceImpl extends SchemaService {
  @inject(HttpService)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  private readonly http: HttpService = null!;

  public getEdgeTypes(cancellation?: CancellationToken): Promise<EdgeType[]> {
    const url = '/schema/edge-types';

    return this.http.get<EdgeType[]>(url, cancellation);
  }

  public getNodeTypes(cancellation?: CancellationToken): Promise<NodeType[]> {
    const url = '/schema/node-types';

    return this.http.get<NodeType[]>(url, cancellation);
  }
}
