import { FilterQuery, QueryResult } from '../shared/queries';
import { EdgeTypeFilterModel, NodeTypeFilterModel } from '../shared/filter';

export abstract class FilterServiceBase {
  public abstract query(query?: FilterQuery): Promise<QueryResult>;

  public abstract getNodeTypeFilterModel(
    type: string
  ): Promise<NodeTypeFilterModel>;

  public abstract getEdgeTypeFilterModel(
    type: string
  ): Promise<EdgeTypeFilterModel>;
}
