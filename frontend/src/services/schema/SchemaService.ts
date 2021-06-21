/* istanbul ignore file */

import { injectable } from 'inversify';
import 'reflect-metadata';
import {
  EdgeType,
  NodeType,
  NodeTypeConnectionInfo,
} from '../../shared/schema';
import { CancellationToken } from '../../utils/CancellationToken';

/**
 * A service that can be used to request information about the data schema.
 */
@injectable()
export default abstract class SchemaService {
  /**
   * Retrieves the types of edges that the schema of the dataset contains.
   * @param cancellation A CancellationToken used to cancel the asynchronous operation.
   * @returns A promise that represents the asynchronous operations. When evaluated, the promise result contains an array of edge types.
   */
  public abstract getEdgeTypes(
    cancellation?: CancellationToken
  ): Promise<EdgeType[]>;

  /**
   * Retrieves the types of nodes that the schema of the dataset contains.
   * @param cancellation A CancellationToken used to cancel the asynchronous operation.
   * @returns A promise that represents the asynchronous operations. When evaluated, the promise result contains an array of node types.
   */
  public abstract getNodeTypes(
    cancellation?: CancellationToken
  ): Promise<NodeType[]>;

  /**
   * Retrieves the connections between node types together with their count.
   * @param cancellation A CancellationToken used to cancel the asynchronous operation.
   * @returns A promise that represents the asynchronous operations. When evaluated, the promise result contains an array of node connections.
   */
  public abstract getNodeTypeConnectionInfo(
    cancellation?: CancellationToken
  ): Promise<NodeTypeConnectionInfo[]>;
}
