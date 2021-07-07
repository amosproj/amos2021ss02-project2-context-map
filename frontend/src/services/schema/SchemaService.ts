/* istanbul ignore file */

import { injectable } from 'inversify';
import 'reflect-metadata';
import { Observable } from 'rxjs';
import {
  EdgeType,
  NodeType,
  NodeTypeConnectionInfo,
} from '../../shared/schema';
import { QueryResult } from '../../shared/queries';

/**
 * A service that can be used to request information about the data schema.
 */
@injectable()
export default abstract class SchemaService {
  /**
   * Retrieves the types of edges that the schema of the dataset contains.
   * @returns Observable that represents the asynchronous operations. When evaluated, an array of edge types is emitted and the observable completes.
   */
  public abstract getEdgeTypes(): Observable<EdgeType[]>;

  /**
   * Retrieves the types of nodes that the schema of the dataset contains.
   * @returns Observable that represents the asynchronous operations. When evaluated, an array of node types is emitted and the observable completes.
   */
  public abstract getNodeTypes(): Observable<NodeType[]>;

  /**
   * Retrieves the connections between node types together with their count.
   * @returns Observable that represents the asynchronous operations. When evaluated, an array of node connections is emitted and the observable completes.
   */
  public abstract getNodeTypeConnectionInfo(): Observable<
    NodeTypeConnectionInfo[]
  >;

  /**
   * Returns a {@link QueryResult} containing the meta information about the
   * graph, i.e. which node types are connected to which other node types.
   *
   * The nodes.types always have the length 1.
   */
  public abstract getMetaGraph(): Observable<QueryResult>;
}
