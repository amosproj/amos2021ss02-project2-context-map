/* istanbul ignore file */

import { injectable } from 'inversify';
import 'reflect-metadata';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CountQueryResult, QueryBase, QueryResult } from '../../shared/queries';
import {
  Edge,
  EdgeDescriptor,
  Node,
  NodeDescriptor,
} from '../../shared/entities';

/**
 * A service that can be used to perform graph queries.
 */
@injectable()
export default abstract class QueryService {
  /**
   * Performs a query for all nodes and edges available within the specified limits.
   * @param query A query that contains limits on the max number of node and edge to deliver.
   * @returns An observable that represents the asynchronous operations. When evaluated, the observable emits the query result of nodes and edges and completes.
   */
  public abstract queryAll(query?: QueryBase): Observable<QueryResult>;

  public getEdgeById(id: number): Observable<Edge | null>;

  public getEdgeById(descriptor: EdgeDescriptor): Observable<Edge | null>;

  public getEdgeById(
    idOrDescriptor: number | EdgeDescriptor
  ): Observable<Edge | null> {
    const id =
      typeof idOrDescriptor === 'number' ? idOrDescriptor : idOrDescriptor.id;
    return this.getEdgesById([id]).pipe(
      map((resultArray) => {
        if (resultArray.length === 0) {
          return null;
        }
        return resultArray[0];
      })
    );
  }

  public abstract getEdgesById(ids: number[]): Observable<Edge[]>;

  public abstract getEdgesById(
    descriptors: EdgeDescriptor[]
  ): Observable<Edge[]>;

  public getNodeById(id: number): Observable<Node | null>;

  public getNodeById(descriptor: NodeDescriptor): Observable<Node | null>;

  public getNodeById(
    idOrDescriptor: number | NodeDescriptor
  ): Observable<Node | null> {
    const id =
      typeof idOrDescriptor === 'number' ? idOrDescriptor : idOrDescriptor.id;
    return this.getNodesById([id]).pipe(
      map((resultArray) => {
        if (resultArray.length === 0) {
          return null;
        }
        return resultArray[0];
      })
    );
  }

  public abstract getNodesById(ids: number[]): Observable<Node[]>;

  public abstract getNodesById(
    descriptors: NodeDescriptor[]
  ): Observable<Node[]>;

  public abstract getNumberOfEntities(): Observable<CountQueryResult>;
}
