import { EdgeTypeFilterModel, NodeTypeFilterModel } from '../shared/filter';

export abstract class FilterServiceBase {
  public abstract getNodeTypeFilterModel(
    nodeType: string
  ): Promise<NodeTypeFilterModel>;

  public abstract getEdgeTypeFilterModel(
    edgeType: string
  ): Promise<EdgeTypeFilterModel>;
}
