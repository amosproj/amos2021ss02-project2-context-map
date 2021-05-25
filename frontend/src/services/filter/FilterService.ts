/* istanbul ignore file */

import { injectable } from 'inversify';
import 'reflect-metadata';
import { EdgeTypeFilterModel, NodeTypeFilterModel } from '../../shared/filter';
import { FilterQuery, QueryResult } from '../../shared/queries';
import { CancellationToken } from '../../utils/CancellationToken';

@injectable()
export default abstract class FilterService {
  public abstract query(
    query?: FilterQuery,
    cancellation?: CancellationToken
  ): Promise<QueryResult>;

  public abstract getNodeTypeFilterModel(
    type: string,
    cancellation?: CancellationToken
  ): Promise<NodeTypeFilterModel>;

  public abstract getEdgeTypeFilterModel(
    type: string,
    cancellation?: CancellationToken
  ): Promise<EdgeTypeFilterModel>;
}
