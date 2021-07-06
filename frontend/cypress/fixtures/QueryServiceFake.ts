import { injectable } from 'inversify';
import { from, Observable } from 'rxjs';
import { QueryService } from '../../src/services/query';
import {
  Edge,
  EdgeDescriptor,
  Node,
  NodeDescriptor,
} from '../../src/shared/entities';
import {
  QueryBase,
  QueryResult,
  CountQueryResult,
} from '../../src/shared/queries';
import { dummies } from './entityDetails/entityDetails';

@injectable()
export default class QueryServiceFake extends QueryService {
  public queryAll(query?: QueryBase): Observable<QueryResult> {
    throw new Error('Method not implemented.');
  }
  public getEdgesById(ids: number[]): Observable<Edge[]>;
  public getEdgesById(descriptors: EdgeDescriptor[]): Observable<Edge[]>;
  public getEdgesById(descriptors: any): Observable<Edge[]> {
    throw new Error('Method not implemented.');
  }
  public getNodesById(ids: number[]): Observable<Node[]>;
  public getNodesById(descriptors: NodeDescriptor[]): Observable<Node[]>;
  public getNodesById(descriptors: any): Observable<Node[]> {
    throw new Error('Method not implemented.');
  }
  public getNumberOfEntities(): Observable<CountQueryResult> {
    throw new Error('Method not implemented.');
  }
  /**
   * returns an observable containing a node by id from {@link dummies}, or null if not found.
   * @param id the id of the node to return.
   */
  public getNodeById(id: number | NodeDescriptor): Observable<Node | null> {
    let node: Node | null = null;
    for (const n of dummies) {
      if (typeof id === 'number' && n.id === id) {
        node = n;
        break;
      }
    }

    if (!node) {
      return from([null]);
    }

    return from([node]);
  }
}
