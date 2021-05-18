import { EdgeTypeFilterModel, NodeTypeFilterModel } from './filter.service';

export abstract class FilterServiceBase {
  public abstract getNodeTypeFilterModel(
    nodeType: string
  ): Promise<NodeTypeFilterModel>;

  public abstract getEdgeTypeFilterModel(
    edgeType: string
  ): Promise<EdgeTypeFilterModel>;
}
