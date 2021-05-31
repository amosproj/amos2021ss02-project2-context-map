/* istanbul ignore file */

import { injectable } from 'inversify';
import 'reflect-metadata';
import { QueryBase, QueryResult } from '../../shared/queries';
import {
  Edge,
  EdgeDescriptor,
  Node,
  NodeDescriptor,
} from '../../shared/entities';

import { CancellationToken } from '../../utils/CancellationToken';

/**
 * A service that can be used to perform graph queries.
 */
@injectable()
export default abstract class QueryService {
  /**
   * Performs a query for all nodes and edges available within the specified limits.
   * @param query A query that contains limits on the max number of node and edge to deliver.
   * @param cancellation A CancellationToken used to cancel the asynchronous operation.
   * @returns A promise that represents the asynchronous operations. When evaluated, the promise result contains the query result of nodes and edges.
   */
  public abstract queryAll(
    query?: QueryBase,
    cancellation?: CancellationToken
  ): Promise<QueryResult>;

  public getEdgeById(
    id: number,
    cancellation?: CancellationToken
  ): Promise<Edge | null>;

  public getEdgeById(
    descriptor: EdgeDescriptor,
    cancellation?: CancellationToken
  ): Promise<Edge | null>;

  public async getEdgeById(
    idOrDescriptor: number | EdgeDescriptor,
    cancellation?: CancellationToken
  ): Promise<Edge | null> {
    const id =
      typeof idOrDescriptor === 'number' ? idOrDescriptor : idOrDescriptor.id;
    const resultArray = await this.getEdgesById([id], cancellation);

    if (resultArray.length === 0) {
      return null;
    }

    return resultArray[0];
  }

  public abstract getEdgesById(
    ids: number[],
    cancellation?: CancellationToken
  ): Promise<Edge[]>;

  public abstract getEdgesById(
    descriptors: EdgeDescriptor[],
    cancellation?: CancellationToken
  ): Promise<Edge[]>;

  public getNodeById(
    id: number,
    cancellation?: CancellationToken
  ): Promise<Node | null>;

  public getNodeById(
    descriptor: NodeDescriptor,
    cancellation?: CancellationToken
  ): Promise<Node | null>;

  public async getNodeById(
    idOrDescriptor: number | NodeDescriptor,
    cancellation?: CancellationToken
  ): Promise<Node | null> {
    const id =
      typeof idOrDescriptor === 'number' ? idOrDescriptor : idOrDescriptor.id;
    const resultArray = await this.getNodesById([id], cancellation);

    if (resultArray.length === 0) {
      return null;
    }

    return resultArray[0];
  }

  public abstract getNodesById(
    ids: number[],
    cancellation?: CancellationToken
  ): Promise<Node[]>;

  public abstract getNodesById(
    descriptors: NodeDescriptor[],
    cancellation?: CancellationToken
  ): Promise<Node[]>;
}
