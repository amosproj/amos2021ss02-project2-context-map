/* istanbul ignore file */

import { injectable } from 'inversify';
import 'reflect-metadata';
import { Observable } from 'rxjs';
import { EdgeTypeFilterModel, NodeTypeFilterModel } from '../../shared/filter';
import { FilterQuery, QueryResult } from '../../shared/queries';

@injectable()
export default abstract class FilterService {
  public abstract query(query?: FilterQuery): Observable<QueryResult>;

  public abstract getNodeTypeFilterModel(
    type: string
  ): Observable<NodeTypeFilterModel>;

  public abstract getEdgeTypeFilterModel(
    type: string
  ): Observable<EdgeTypeFilterModel>;
}
